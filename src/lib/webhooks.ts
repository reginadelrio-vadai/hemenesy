async function send(url: string, payload: Record<string, any>) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString(), source: "hemenesy" }),
    });
  } catch (e) {
    console.error("Webhook failed:", e);
  }
}

export const webhookDesignGenerated = (d: Record<string, any>) =>
  send(process.env.N8N_WEBHOOK_DESIGN_GENERATED!, d);

export const webhookQuoteRequested = (d: Record<string, any>) =>
  send(process.env.N8N_WEBHOOK_QUOTE_REQUESTED!, d);

export const webhookNewContact = (d: Record<string, any>) =>
  send(process.env.N8N_WEBHOOK_NEW_CONTACT!, d);
