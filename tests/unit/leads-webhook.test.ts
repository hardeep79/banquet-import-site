import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
});

import { postToAgentWebhook } from "@/lib/leads/webhook";

describe("postToAgentWebhook", () => {
  it("is a no-op when AGENT_WEBHOOK_URL is unset", async () => {
    process.env.AGENT_WEBHOOK_URL = "";
    const fetchMock = vi.fn();
    global.fetch = fetchMock as typeof fetch;
    await postToAgentWebhook({ source: "quote", name: "x" } as unknown as Parameters<typeof postToAgentWebhook>[0]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POSTs JSON when AGENT_WEBHOOK_URL is set", async () => {
    process.env.AGENT_WEBHOOK_URL = "https://agent.example/leads";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response);
    global.fetch = fetchMock as typeof fetch;
    await postToAgentWebhook({ source: "contact", name: "Joe" } as unknown as Parameters<typeof postToAgentWebhook>[0]);
    expect(fetchMock).toHaveBeenCalledOnce();
    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe("https://agent.example/leads");
    expect(call?.[1]?.method).toBe("POST");
    expect((call?.[1]?.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
  });

  it("does not throw on network failure", async () => {
    process.env.AGENT_WEBHOOK_URL = "https://agent.example/leads";
    global.fetch = vi.fn().mockRejectedValue(new Error("net")) as typeof fetch;
    await expect(
      postToAgentWebhook({ source: "contact", name: "Joe" } as unknown as Parameters<typeof postToAgentWebhook>[0]),
    ).resolves.toBeUndefined();
  });
});
