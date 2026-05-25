import { google } from "googleapis";
import { Buffer } from "node:buffer";

export interface SheetRow {
  timestamp: string;
  source: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessType: string;
  orderSize: string;
  city: string;
  province: string;
  categories: string;
  products: string;
  budget: string;
  needBy: string;
  notes: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  ipCountry: string;
}

function loadCredentials() {
  const blob = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!blob) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON env var");
  }
  const decoded = Buffer.from(blob, "base64").toString("utf8");
  return JSON.parse(decoded) as { client_email: string; private_key: string };
}

export async function appendLeadRow(row: SheetRow): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("Missing GOOGLE_SHEET_ID env var");
  const creds = loadCredentials();

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: creds.client_email, private_key: creds.private_key },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A:S",
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        row.timestamp, row.source, row.name, row.company, row.email, row.phone,
        row.businessType, row.orderSize, row.city, row.province,
        row.categories, row.products, row.budget, row.needBy, row.notes,
        row.utmSource, row.utmMedium, row.utmCampaign, row.ipCountry,
      ]],
    },
  });
}
