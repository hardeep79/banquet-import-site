import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "msg-1" }, error: null });
  process.env.RESEND_API_KEY = "re_xxx";
  process.env.LEAD_NOTIFY_EMAIL = "owner@example.com";
  process.env.LEAD_FROM_EMAIL = "Maison Banquet <noreply@maison.test>";
});

import { sendInternalNotification, sendLeadAutoReply } from "@/lib/leads/emails";

describe("sendInternalNotification", () => {
  it("sends to LEAD_NOTIFY_EMAIL with a subject containing the source", async () => {
    await sendInternalNotification({
      source: "quote",
      summary: { name: "Jane", email: "j@e.com" },
      html: "<p>raw lead</p>",
    });
    expect(sendMock).toHaveBeenCalledOnce();
    const args = sendMock.mock.calls[0]?.[0];
    expect(args.to).toBe("owner@example.com");
    expect(args.subject).toMatch(/quote/i);
    expect(args.html).toContain("raw lead");
  });
});

describe("sendLeadAutoReply", () => {
  it("uses quote template for source=quote", async () => {
    await sendLeadAutoReply({ source: "quote", to: "jane@example.com", name: "Jane" });
    const args = sendMock.mock.calls[0]?.[0];
    expect(args.to).toBe("jane@example.com");
    expect(args.subject).toMatch(/quote/i);
    expect(args.html).toMatch(/24 hours/i);
  });
  it("uses contact template for source=contact", async () => {
    await sendLeadAutoReply({ source: "contact", to: "j@e.com", name: "Joe" });
    const args = sendMock.mock.calls[0]?.[0];
    expect(args.subject).toMatch(/received/i);
  });
  it("no-ops if RESEND_API_KEY is missing", async () => {
    process.env.RESEND_API_KEY = "";
    await sendLeadAutoReply({ source: "contact", to: "j@e.com", name: "Joe" });
    expect(sendMock).not.toHaveBeenCalled();
  });
});
