import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { webhookQuoteRequested } from "@/lib/webhooks";
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

    const body = await request.json();
    const { designId, contactPreference, advisorNotes } = body;
    if (!designId || !contactPreference)
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });

    // RLS filtra automáticamente — solo ve diseños del usuario
    const { data: design } = await supabase.from("designs").select("id, status, jewelry_type, design_style, metal, emerald_type, complementary_stones, engraving, additional_notes, image_url").eq("id", designId).single();
    if (!design) return NextResponse.json({ error: "Diseño no encontrado" }, { status: 404 });
    if (design.status === "quote_requested")
      return NextResponse.json({ error: "Ya solicitaste cotización para este diseño" }, { status: 409 });

    const { error: insertErr } = await supabaseAdmin.from("quote_requests").insert({
      user_id: user.id,
      design_id: designId,
      contact_preference: contactPreference,
      advisor_notes: advisorNotes || "",
    });
    if (insertErr) throw insertErr;

    await supabaseAdmin
      .from("designs")
      .update({ status: "quote_requested", updated_at: new Date().toISOString() })
      .eq("id", designId);

    const { data: prof } = await supabaseAdmin
      .from("user_profiles")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .single();

    webhookQuoteRequested({
      userId: user.id,
      userName: prof?.full_name,
      userEmail: prof?.email,
      userPhone: prof?.phone,
      designId,
      contactPreference,
      advisorNotes,
      jewelryType: design?.jewelry_type,
      designStyle: design?.design_style,
      metal: design?.metal,
      emeraldType: design?.emerald_type,
      complementaryStones: design?.complementary_stones,
      engraving: design?.engraving,
      additionalNotes: design?.additional_notes,
      imageUrl: design?.image_url,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
