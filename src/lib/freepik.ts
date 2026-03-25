import { SupabaseClient } from "@supabase/supabase-js";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY!;
const BASE_URL = "https://api.freepik.com/v1/ai/mystic";

export async function generateImage(prompt: string): Promise<string> {
  const createRes = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-freepik-api-key": FREEPIK_API_KEY,
    },
    body: JSON.stringify({
      prompt,
      resolution: "2k",
      aspect_ratio: "square_1_1",
      model: "realism",
      engine: "magnific_sharpy",
      creative_detailing: 40,
      fixed_generation: false,
      filter_nsfw: true,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    console.error("Freepik create error:", err);
    throw new Error("Error al iniciar generación");
  }

  const createData = await createRes.json();
  const taskId = createData?.data?.task_id;
  if (!taskId) throw new Error("No task_id received");

  // Polling hasta completar (máx ~90s)
  const maxAttempts = 30;
  const pollInterval = 3000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const pollRes = await fetch(`${BASE_URL}/${taskId}`, {
      headers: { "x-freepik-api-key": FREEPIK_API_KEY },
    });

    if (!pollRes.ok) continue;

    const pollData = await pollRes.json();
    const status = pollData?.data?.status;

    if (status === "COMPLETED") {
      const url = pollData?.data?.generated?.[0];
      if (!url) throw new Error("No image URL in completed task");
      return url;
    }

    if (status === "FAILED" || status === "ERROR") {
      throw new Error("La generación falló");
    }
  }

  throw new Error("TIMEOUT");
}

export async function persistImage(
  tempUrl: string,
  userId: string,
  designId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: SupabaseClient<any, any, any>
): Promise<string> {
  const res = await fetch(tempUrl);
  if (!res.ok) throw new Error("Download failed");
  const buf = Buffer.from(await res.arrayBuffer());
  const path = `${userId}/${designId}.png`;
  const { error } = await admin.storage
    .from("designs")
    .upload(path, buf, { contentType: "image/png" });
  if (error) throw error;
  return admin.storage.from("designs").getPublicUrl(path).data.publicUrl;
}
