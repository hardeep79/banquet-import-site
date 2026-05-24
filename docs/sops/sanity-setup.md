# Sanity Setup — One-Time

## Create the project

1. From the project root run:
   ```
   npx --yes create-sanity@latest --output-path=tmp-sanity --typescript
   ```
2. Choose "Create new project" — pick a project name (e.g. `Maison Banquet`) and an organization.
3. When the CLI asks "Would you like to add configuration files for a Sanity project in this Next.js folder?" answer **N** — we ship Studio code from `src/studio/`, not the scaffolder.
4. When asked about MCP integration, optionally pick **Claude Code** to wire up the Sanity MCP server for future content edits via Claude.
5. After the (intentional) failure to scaffold `tmp-sanity/package.json`, note the project ID from CLI output. Verify at https://www.sanity.io/manage.
6. Discard the `tmp-sanity/` directory if it materialized — schemas live in `src/studio/schemas/`.

## Env vars

In `.env.local` and Vercel project settings:

- `NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_READ_TOKEN=<Viewer token, https://www.sanity.io/manage → project → API → Tokens → Add>`
- `SANITY_WEBHOOK_SECRET=<random ≥32 chars; you choose>` — e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Seeding only (local-only):**
- `SANITY_WRITE_TOKEN=<Editor token>` — DO NOT add this to Vercel.

## Embedded Studio

Studio is served at `/studio`. First visit prompts a Sanity login.

## Revalidate webhook

Sanity Manage → API → Webhooks → Add:
- URL: `https://<vercel-url>/api/revalidate`
- Trigger on: Create, Update, Delete
- Filter: `_type in ["category","product","galleryItem","siteSettings","legalPage"]`
- Projection: `{ _type, slug }`
- HTTP method: POST
- Headers: `x-webhook-secret: <SANITY_WEBHOOK_SECRET>`

Test by editing a Category in Studio — within ~5s the production site should reflect the change on next visit.

## Seeding

1. Set `SANITY_WRITE_TOKEN` in `.env.local` (Editor-permission token).
2. `npm run seed` — uploads 10 categories + 20 products + 30 gallery items + 1 siteSettings.
3. Verify in Studio.

## Troubleshooting

- Studio shows "Missing NEXT_PUBLIC_SANITY_PROJECT_ID" — env var not loaded. Restart `npm run dev`.
- 401 on read queries — `SANITY_API_READ_TOKEN` wrong or expired.
- Webhook firing but nothing revalidates — verify the `x-webhook-secret` header matches the env var byte-for-byte.
- Images don't render on the site — confirm `next.config.ts` `images.remotePatterns` includes `{ hostname: "cdn.sanity.io" }`.
