import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/leads/sheets", () => ({ appendLeadRow: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/leads/emails", () => ({
  sendInternalNotification: vi.fn().mockResolvedValue(undefined),
  sendLeadAutoReply: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/leads/webhook", () => ({ postToAgentWebhook: vi.fn().mockResolvedValue(undefined) }));

import { submitLead } from "@/lib/leads/submit";
import { appendLeadRow } from "@/lib/leads/sheets";
import { sendInternalNotification, sendLeadAutoReply } from "@/lib/leads/emails";
import { postToAgentWebhook } from "@/lib/leads/webhook";

const validQuote = {
  source: "quote" as const,
  name: "Jane",
  company: "Northwood",
  email: "jane@northwood.com",
  phone: "416-555-0100",
  businessType: "banquet-hall" as const,
  orderSize: "11-50-cases" as const,
  city: "Toronto",
  province: "ON",
  categories: ["chiavari-chairs"],
  products: [],
  budget: "15-50k" as const,
  needBy: "2026-08-01",
  notes: "",
  consent: true as const,
  honeypot: "" as const,
  turnstileToken: "tok",
};

beforeEach(() => vi.clearAllMocks());

describe("submitLead", () => {
  it("fans out to all sinks for a quote payload", async () => {
    await submitLead(validQuote, { ipCountry: "CA" });
    expect(appendLeadRow).toHaveBeenCalledOnce();
    expect(sendInternalNotification).toHaveBeenCalledOnce();
    expect(sendLeadAutoReply).toHaveBeenCalledOnce();
    expect(postToAgentWebhook).toHaveBeenCalledOnce();
  });

  it("does not throw if one sink fails", async () => {
    (appendLeadRow as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("sheets down"));
    await expect(submitLead(validQuote, {})).resolves.toBeUndefined();
    expect(sendInternalNotification).toHaveBeenCalledOnce();
  });
});
