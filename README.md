This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Performance baseline (2026-05-24)

| Route | Performance | Accessibility | SEO |
|---|---|---|---|
| / | 0.95 | 1.00 | 1.00 |
| /catalog/chiavari-chairs/gold-luxe-chiavari | 0.87 | 1.00 | 0.92 |

Re-run: `npm run build && npm start &` then `npx lighthouse <url>`.

Notes (only relevant if score < 0.95 on perf):
- Product LCP is 4.0s (score 0.49) — driven by the hero Pexels image rendered via Sanity-resolved next/image. Real luxury hero will be seeded via `siteSettings.defaultOgImage` before promotion.
- `unused-javascript` flags ~97 KiB savings — Studio + framework bundle code that ships on first paint.
- Product SEO loses points on `meta-description` (missing on PDP) — add per-product description metadata.
- Sanity CDN images use `@sanity/image-url` for WebP/AVIF transforms.
