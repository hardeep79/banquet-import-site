# Resend (Transactional Email) — One-Time Setup

## 1. Account + API key

1. https://resend.com → sign up (or log in).
2. API Keys → Create → permission "Sending access". Copy the key (starts `re_`).
3. Set in `.env.local` + Vercel env vars:

```
RESEND_API_KEY=<paste>
```

## 2. From-address

Until a real domain is verified, the from-address falls back to `Maison Banquet <noreply@maisonbanquet.example>` and Resend will reject. Two options:

**A. (Recommended for v1) Use Resend's onboarding sandbox domain**

Set `LEAD_FROM_EMAIL="Maison Banquet <onboarding@resend.dev>"`. Works without verification; emails are delivered but show that from-address. Acceptable while you sort the real domain.

**B. Verify the real domain**

Resend → Domains → Add `<your-domain.com>` → follow DNS instructions (SPF, DKIM, optional DMARC). Once verified, set:

```
LEAD_FROM_EMAIL="Maison Banquet <noreply@<your-domain.com>>"
```

## 3. Internal notify destination

```
LEAD_NOTIFY_EMAIL=hardeep.singh@futurewavesol.com
```

## 4. Smoke test

Submit a lead via `/quote`. Within ~30s both emails should arrive:
- Internal notify (to `LEAD_NOTIFY_EMAIL`) with the full lead summary as an HTML table.
- Auto-reply (to the email the user typed) — quote template says "We'll reply within 24 hours."

## Troubleshooting

- No emails — `RESEND_API_KEY` blank or wrong. Code no-ops silently when the key is missing.
- 422 from Resend on send — from-address not verified for the domain. Switch to `onboarding@resend.dev` or verify the domain.
- Auto-reply not arriving — check Resend dashboard for the message; check spam.
