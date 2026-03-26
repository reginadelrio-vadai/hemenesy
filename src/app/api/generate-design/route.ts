import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateImage, persistImage } from "@/lib/freepik";
import { buildPrompt } from "@/lib/prompts";
import { webhookDesignGenerated } from "@/lib/webhooks";
import { VALID_OPTIONS } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // Ensure profile exists (in case the DB trigger failed at signup)
    await supabaseAdmin.from("user_profiles").upsert(
      {
        id: user.id,
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        generation_count_today: 0,
        last_generation_date: new Date().toISOString().split("T")[0],
      },
      { onConflict: "id", ignoreDuplicates: true }
    );

    const { data: cnt } = await supabaseAdmin.rpc("check_and_update_generation_count", { p_user_id: user.id });
    if (cnt === -1) return NextResponse.json({ error: "Límite de 3 diseños por día alcanzado." }, { status: 429 });

    const body = await request.json();
    const { jewelryType, designStyle, metal, emeraldType, complementaryStones, engraving, additionalNotes } = body;

    if (
      !VALID_OPTIONS.jewelryType.includes(jewelryType) ||
      !VALID_OPTIONS.designStyle.includes(designStyle) ||
      !VALID_OPTIONS.metal.includes(metal) ||
      !VALID_OPTIONS.emeraldType.includes(emeraldType) ||
      (complementaryStones && !VALID_OPTIONS.complementaryStones.includes(complementaryStones))
    ) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const prompt = buildPrompt({ jewelryType, designStyle, metal, emeraldType, complementaryStones, additionalNotes });

    let tempUrl: string;
    try {
      tempUrl = await generateImage(prompt);
    } catch (err: unknown) {
      await supabaseAdmin
        .from("user_profiles")
        .update({ generation_count_today: cnt - 1 })
        .eq("id", user.id);
      return NextResponse.json(
        { error: (err instanceof Error && err.message?.includes("TIMEOUT")) ? "La generación tardó demasiado." : "Error al generar." },
        { status: 502 }
      );
    }

    const { data: design, error: ie } = await supabaseAdmin
      .from("designs")
      .insert({
        user_id: user.id,
        jewelry_type: jewelryType,
        design_style: designStyle,
        metal,
        emerald_type: emeraldType,
        complementary_stones: complementaryStones || "ninguna",
        engraving: engraving || false,
        additional_notes: additionalNotes || "",
        status: "generated",
      })
      .select("id")
      .single();
    if (ie || !design) throw ie;

    let imageUrl: string;
    let persisted = false;
    try {
      imageUrl = await persistImage(tempUrl, user.id, design.id, supabaseAdmin);
      persisted = true;
    } catch {
      imageUrl = tempUrl;
    }

    await supabaseAdmin
      .from("designs")
      .update({ image_url: imageUrl, image_persisted: persisted })
      .eq("id", design.id);

    const { data: prof } = await supabaseAdmin
      .from("user_profiles")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .single();

    webhookDesignGenerated({
      userId: user.id,
      userName: prof?.full_name,
      userEmail: prof?.email,
      userPhone: prof?.phone,
      designId: design.id,
      jewelryType,
      designStyle,
      metal,
      emeraldType,
      complementaryStones,
      engraving,
      additionalNotes,
      imageUrl,
    }).catch(console.error);

    return NextResponse.json({ designId: design.id, imageUrl, generationsRemaining: 3 - cnt });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
