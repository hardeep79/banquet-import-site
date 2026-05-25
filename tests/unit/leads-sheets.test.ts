import { describe, it, expect, vi, beforeEach } from "vitest";
import { Buffer } from "node:buffer";

const appendMock = vi.fn();

vi.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: class {
        constructor() {}
        async getClient() {
          return {};
        }
      },
    },
    sheets: () => ({ spreadsheets: { values: { append: appendMock } } }),
  },
}));

beforeEach(() => {
  appendMock.mockReset();
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON = Buffer.from(
    JSON.stringify({
      client_email: "x@x.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\nk\n-----END PRIVATE KEY-----\n",
    }),
  ).toString("base64");
  process.env.GOOGLE_SHEET_ID = "sheet-id";
});

import { appendLeadRow } from "@/lib/leads/sheets";

describe("appendLeadRow", () => {
  it("appends a row with the expected column order", async () => {
    appendMock.mockResolvedValue({ data: {} });
    await appendLeadRow({
      timestamp: "2026-05-19T20:00:00Z",
      source: "quote",
      name: "Jane",
      company: "X",
      email: "jane@x.com",
      phone: "555",
      businessType: "banquet-hall",
      orderSize: "11-50-cases",
      city: "Toronto",
      province: "ON",
      categories: "chiavari-chairs,linens",
      products: "",
      budget: "15-50k",
      needBy: "2026-08-01",
      notes: "n",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      ipCountry: "CA",
    });
    expect(appendMock).toHaveBeenCalledOnce();
    const call = appendMock.mock.calls[0]?.[0];
    expect(call.spreadsheetId).toBe("sheet-id");
    expect(call.range).toBe("A:S");
    expect(call.valueInputOption).toBe("RAW");
    expect(call.requestBody.values[0]).toEqual([
      "2026-05-19T20:00:00Z", "quote", "Jane", "X", "jane@x.com", "555",
      "banquet-hall", "11-50-cases", "Toronto", "ON",
      "chiavari-chairs,linens", "", "15-50k", "2026-08-01", "n",
      "", "", "", "CA",
    ]);
  });

  it("throws if service account env is missing", async () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = "";
    await expect(
      appendLeadRow({
        timestamp: "t",
        source: "contact",
        name: "n",
        company: "",
        email: "e@e.com",
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
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        ipCountry: "",
      }),
    ).rejects.toThrow(/GOOGLE_SERVICE_ACCOUNT_JSON/);
  });
});
