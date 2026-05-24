# Promote to Live — Checklist

Do not run this until placeholder content is fully replaced.

## 1. Brand swap

- [ ] Edit `src/lib/brand.ts` — replace placeholder name, tagline, email, phone with real values. Set `isPlaceholder: false`.
- [ ] Update Sanity `siteSettings` (in Studio) with real phone, email, and `serviceAreaCopy` if it differs.
- [ ] Replace `public/og-default.jpg` with a real branded OG image (1200×630 recommended).
- [ ] Replace `src/app/favicon.ico` with the real favicon.

## 2. Legal copy

- [ ] In Studio → Legal Page → publish docs with slugs `privacy` and `terms` containing real legal copy. The placeholder fallback on `/privacy` and `/terms` disappears as soon as the docs exist.

## 3. Domain

- [ ] Register the domain (e.g. `maisonbanquet.com`).
- [ ] Vercel → Project → Domains → Add → follow DNS instructions.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://<real-domain>` in Production env vars.
- [ ] Trigger a redeploy so `/sitemap.xml` and `/robots.txt` use the real URL.

## 4. Resend domain verification

- [ ] Resend → Domains → Add and verify the real domain.
- [ ] Update `LEAD_FROM_EMAIL="Maison Banquet <noreply@<real-domain>>"` in Vercel env vars.

## 5. Turnstile

- [ ] Cloudflare Turnstile → add the real domain to the site list.

## 6. Final perf check

- [ ] `npm run build && npm start` locally.
- [ ] `npx lighthouse https://<real-domain> --only-categories=performance,accessibility,seo` — confirm ≥ 0.95 on perf + a11y, ≥ 1.00 on SEO.

## 7. Final smoke

- [ ] Submit a real test quote — verify the row lands in the Sheet, both Resend emails arrive, no error in Vercel logs.
- [ ] Submit the contact form — same checks.
- [ ] Visit `/studio` → log in → publish a tiny edit to verify the revalidate webhook works (the site should reflect the change within ~5s).
- [ ] Vercel Analytics enabled in project settings.

## 8. Known cleanup items
- [ ] Product page meta-description audit (Lighthouse 0.92 SEO).
- [ ] Product page LCP optimization (was 4.0s).
- [ ] 97 KiB unused JS on product page — try `serverExternalPackages: ['sanity']`.
- [ ] Migrate `@sanity/image-url` to named export `createImageUrlBuilder`.
- [ ] Replace `next/image` `priority` prop usages with the Next 16 replacement.

## 9. Announce
