import type { LeadPayload } from "./schema";

export async function postToAgentWebhook(payload: LeadPayload): Promise<void> {
  const url = process.env.AGENT_WEBHOOK_URL;
  if (!url) return;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(t);
  } catch (err) {
    console.warn("[agent-webhook] post failed (non-fatal)", err);
  }
}
