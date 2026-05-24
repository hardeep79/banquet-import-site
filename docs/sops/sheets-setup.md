# Google Sheets Lead Capture — One-Time Setup

## 1. Create the sheet

1. Google Drive → New → Google Sheets → name it **"Maison Banquet — Leads"**.
2. Copy the sheet ID from the URL: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`.
3. Set `GOOGLE_SHEET_ID=<SHEET_ID>` in `.env.local` and Vercel env vars.

## 2. Add the header row

Paste into row 1 (tab-separated, will split into 20 columns):

```
timestamp	source	name	company	email	phone	event_type	event_date	headcount	city	province	categories	products	budget	need_by	notes	utm_source	utm_medium	utm_campaign	ip_country
```

## 3. Create a service account

1. https://console.cloud.google.com → pick or create a project.
2. APIs & Services → Library → enable **Google Sheets API**.
3. APIs & Services → Credentials → Create Credentials → Service Account.
   - Name: `maison-banquet-leads`
   - Skip role grants (no project-level access needed).
4. After creation: Keys tab → Add key → JSON → download.

## 4. Share the sheet with the service account

Open the downloaded JSON key. Copy the `client_email` value (e.g. `maison-banquet-leads@<project>.iam.gserviceaccount.com`).
In the sheet → Share → paste the email → **Editor** → Send.

## 5. Encode the JSON key for the env var

PowerShell:

```pwsh
[Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\key.json"))
```

Bash:

```bash
base64 -w0 path/to/key.json
```

Paste the single-line output into `.env.local`:

```
GOOGLE_SERVICE_ACCOUNT_JSON=<base64 blob>
```

Mirror into Vercel project env vars (Production + Preview).

## 6. Smoke test

```
npm run dev
```

Submit a real test through `/quote`. Open the sheet — confirm a row landed in row 2 with all 20 columns populated.

## Troubleshooting

- "Missing GOOGLE_SERVICE_ACCOUNT_JSON env var" thrown from `/api/lead` — env not loaded; verify the var is set and `.env.local` is in the project root.
- "PERMISSION_DENIED" from the Sheets API — service account not shared on the sheet, or shared with the wrong email. The service account's email is in the JSON key's `client_email` field.
- Test landed but row is in the wrong sheet — `GOOGLE_SHEET_ID` mismatch.
