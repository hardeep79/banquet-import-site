# Cloudflare Turnstile — One-Time Setup

## 1. Site + secret keys

1. https://dash.cloudflare.com → Turnstile → Add a site.
2. Domain: leave blank for "any domain" while developing, or add `vercel.app` + your production domain.
3. Widget Mode: **Managed**.
4. Copy **Site Key** and **Secret Key**.
5. Set in `.env.local` + Vercel env vars:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<paste>
TURNSTILE_SECRET_KEY=<paste>
```

## 2. Dev fallback

If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset, the form bypasses Turnstile in the browser (sends `dev-bypass-token`). The server-side `verifyTurnstile` will REJECT a `dev-bypass-token` (it asks Cloudflare to verify and Cloudflare returns failure for the placeholder). So:

- **Both set:** Turnstile enforced. Submissions accepted only on verified tokens.
- **Both unset:** Form usable locally; submissions rejected by the server with `turnstile-failed` 400. Acceptable for local dev where you want to inspect the request shape but not actually persist.

## 3. Production check

After deploy, submit a real lead form. Turnstile renders an invisible widget; the form should accept the submission and 200 back from `/api/lead`. If you see a visible challenge ("I am not a robot"), the IP is rate-limited or flagged — wait or switch network.

## Troubleshooting

- `turnstile-failed` 400 on every submission — `TURNSTILE_SECRET_KEY` wrong, or site key/secret key mismatch.
- Widget never renders in browser — `NEXT_PUBLIC_TURNSTILE_SITE_KEY` not set OR client-side env var didn't bake into the build (env vars prefixed `NEXT_PUBLIC_` are inlined at build time; restart `next build` if you set it after building).
