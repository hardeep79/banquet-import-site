import { Resend } from "resend";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function from(): string {
  return process.env.LEAD_FROM_EMAIL ?? "Maison Banquet <noreply@maisonbanquet.example>";
}

export async function sendInternalNotification(input: {
  source: "quote" | "contact";
  summary: Record<string, unknown>;
  html: string;
}): Promise<void> {
  const client = getClient();
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!client || !to) return;
  await client.emails.send({
    from: from(),
    to,
    subject: `[Maison Banquet] new ${input.source} lead — ${String(input.summary.name ?? "(no name)")}`,
    html: input.html,
  });
}

export async function sendLeadAutoReply(input: {
  source: "quote" | "contact";
  to: string;
  name: string;
}): Promise<void> {
  const client = getClient();
  if (!client) return;

  const isQuote = input.source === "quote";
  const subject = isQuote
    ? "We've received your quote request — Maison Banquet Co."
    : "We've received your message — Maison Banquet Co.";
  const body = isQuote
    ? `<p>Hi ${escape(input.name)},</p>
       <p>Thanks for reaching out — we've received your quote request. A member of our team will review the details and reply within <strong>24 hours</strong> with sourcing options, pricing, and a delivery timeline.</p>
       <p>— Maison Banquet Co.</p>`
    : `<p>Hi ${escape(input.name)},</p>
       <p>Thanks for the note — we've received your message and will reply shortly.</p>
       <p>— Maison Banquet Co.</p>`;

  await client.emails.send({ from: from(), to: input.to, subject, html: body });
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
