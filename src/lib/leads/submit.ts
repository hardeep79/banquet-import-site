import type { LeadPayload } from "./schema";
import { appendLeadRow, type SheetRow } from "./sheets";
import { sendInternalNotification, sendLeadAutoReply } from "./emails";
import { postToAgentWebhook } from "./webhook";

interface SubmitContext {
  ipCountry?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
}

export async function submitLead(payload: LeadPayload, ctx: SubmitContext): Promise<void> {
  const timestamp = new Date().toISOString();
  const row: SheetRow = toSheetRow(payload, timestamp, ctx);
  const summary = toSummary(payload);
  const html = toHtml(payload, timestamp);

  const results = await Promise.allSettled([
    appendLeadRow(row),
    sendInternalNotification({ source: payload.source, summary, html }),
    sendLeadAutoReply({ source: payload.source, to: payload.email, name: payload.name }),
    postToAgentWebhook(payload),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      console.warn("[lead-submit] sink failed (non-fatal)", r.reason);
    }
  }
}

function toSheetRow(p: LeadPayload, timestamp: string, ctx: SubmitContext): SheetRow {
  const base = {
    timestamp,
    source: p.source,
    name: p.name,
    email: p.email,
    company: "",
    phone: "",
    businessType: "",
    orderSize: "",
    city: "",
    province: "",
    categories: "",
    products: "",
    budget: "",
    needBy: "",
    notes: "",
    utmSource: ctx.utm?.source ?? "",
    utmMedium: ctx.utm?.medium ?? "",
    utmCampaign: ctx.utm?.campaign ?? "",
    ipCountry: ctx.ipCountry ?? "",
  };
  if (p.source === "quote") {
    return {
      ...base,
      company: p.company,
      phone: p.phone,
      businessType: p.businessType,
      orderSize: p.orderSize,
      city: p.city,
      province: p.province,
      categories: p.categories.join(","),
      products: p.products.join(","),
      budget: p.budget,
      needBy: p.needBy,
      notes: p.notes ?? "",
    };
  }
  return { ...base, notes: p.message };
}

function toSummary(p: LeadPayload): Record<string, unknown> {
  if (p.source === "quote") {
    return {
      name: p.name, company: p.company, email: p.email, phone: p.phone,
      businessType: p.businessType, orderSize: p.orderSize,
      city: p.city, province: p.province, budget: p.budget,
      categories: p.categories, products: p.products,
    };
  }
  return { name: p.name, email: p.email, message: p.message };
}

function toHtml(p: LeadPayload, timestamp: string): string {
  const entries = Object.entries(toSummary(p));
  const rows = entries
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${String(v)}</td></tr>`)
    .join("");
  return `<p>New ${p.source} lead at ${timestamp}.</p><table>${rows}</table>`;
}
