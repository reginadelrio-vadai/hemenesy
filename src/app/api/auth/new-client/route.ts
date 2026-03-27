import { webhookNewClient } from "@/lib/webhooks";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    webhookNewClient({
      fullName,
      email,
      phone,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("New client webhook error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
