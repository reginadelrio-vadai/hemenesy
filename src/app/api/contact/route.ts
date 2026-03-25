import { supabaseAdmin } from "@/lib/supabase/admin";
import { webhookNewContact } from "@/lib/webhooks";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, requestType, message } = body;
    if (!fullName || !email || !phone || !requestType)
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });

    // Rate limit: no más de 1 solicitud por email en 5 minutos
    const { data: recent } = await supabaseAdmin
      .from("contact_requests")
      .select("id")
      .eq("email", email)
      .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());
    if (recent && recent.length > 0)
      return NextResponse.json(
        { error: "Ya recibimos tu solicitud. Un asesor te contactará pronto." },
        { status: 429 }
      );

    const { error } = await supabaseAdmin.from("contact_requests").insert({
      full_name: fullName,
      email,
      phone,
      request_type: requestType,
      message: message || "",
    });
    if (error) throw error;

    webhookNewContact({ fullName, email, phone, requestType, message }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
