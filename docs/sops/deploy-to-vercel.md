# Deploy to Vercel — One-Time

## 1. Push to GitHub

1. Create a private GitHub repo (e.g. `maison-banquet`).
2. From the project root:

```
git branch -M main     # rename master → main if not already
git remote add origin <repo-url>
git push -u origin main
```

## 2. Create Vercel project

1. https://vercel.com → New Project → Import the GitHub repo.
2. Framework: Next.js (auto-detected).
3. Root directory: `projects/banquet-import-site` if the repo is the Playground monorepo; otherwise `.`.
4. Build & Output settings: defaults.

## 3. Wire env vars

Settings → Environment Variables. Add every var from `.env.example` to both **Production** and **Preview** environments:

| Var | Source |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity dashboard |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | Sanity Viewer token |
| `SANITY_WEBHOOK_SECRET` | random ≥32 chars |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | base64-encoded JSON key |
| `GOOGLE_SHEET_ID` | from sheet URL |
| `RESEND_API_KEY` | Resend dashboard |
| `LEAD_NOTIFY_EMAIL` | your inbox |
| `LEAD_FROM_EMAIL` | "Brand <addr>" string |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile |
| `AGENT_WEBHOOK_URL` | leave blank in v1 |
| `NEXT_PUBLIC_SITE_URL` | Vercel preview URL initially (`https://<project>.vercel.app`) |

Do NOT add `SANITY_WRITE_TOKEN` to Vercel — it's seed-only and local-only.

## 4. Deploy

Push to `main` to trigger the first deploy. Wait for the build (~2 min). Open the preview URL.

## 5. Verify

- `/` renders with the 10 seeded categories.
- `/catalog/chiavari-chairs/gold-luxe-chiavari` renders with spec sheet + image gallery.
- `/studio` loads Sanity Studio.
- `curl -X POST -H "Content-Type: application/json" -d '{}' https://<url>/api/lead` returns HTTP 400 with `{"error":"validation",...}`.
- `/sitemap.xml` returns the static + category + product URLs.
- `/robots.txt` blocks `/studio` and `/api/`.

## 6. Wire the Sanity revalidate webhook

See `docs/sops/sanity-setup.md` § Revalidate webhook. Point it at `https://<vercel-prod-url>/api/revalidate` with the `x-webhook-secret` header.
