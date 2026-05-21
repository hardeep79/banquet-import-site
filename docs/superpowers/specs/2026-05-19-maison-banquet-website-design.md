# Maison Banquet Co. — Website v1 Design Spec

**Date:** 2026-05-19
**Status:** Approved — ready for implementation planning
**Project location:** `projects/banquet-import-site/`
**Working brand name:** Maison Banquet Co. (placeholder — swap before promoting to live)

---

## 1. Context & Goal

A new, standalone B2B business that imports banquet hall products from China and distributes them across Canada. Target buyers: banquet halls, wedding venues, event centers, hotels, decorators, event planners, rental companies, restaurants, conference centers.

The site we ship is a **demo that becomes production**. Same artifact serves both purposes — we just don't point a real domain at it until the owner says go. Architecture, code quality, performance budget, and content schema are all production-grade from commit one.

**Single v1 goal:** be live, look luxurious, capture qualified B2B quote requests, and instrument the lead data so future agents can hook in.

**Out of scope for v1** (deferred deliberately — see Section 9): AI chatbot, AI quote assistant, AI product recommender, programmatic SEO city pages, blog content, WhatsApp integration, image enhancement pipeline (Sanity CDN handles it), e-commerce checkout, multilingual, inventory/supplier management.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + ISR, route-segment code splitting, image optimization, sitemap generation, file-based routing — every requirement met without bolt-ons. |
| Language | TypeScript (strict) | Schema-typed end-to-end via Sanity typegen. |
| Styling | Tailwind CSS v4 | Design tokens in config, zero-runtime overhead, matches the rest of the Playground stack. |
| Animation | Framer Motion | Restrained motion language (see Section 6). |
| UI primitives | shadcn/ui, restyled | Buttons, inputs, dialog, dropdown, select. Owned-in-repo, no library lock-in. |
| CMS | Sanity v3, Studio embedded at `/studio` | Non-technical product entry from day one, free tier covers expected volume, built-in image CDN with on-the-fly WebP/AVIF + responsive transforms. |
| Lead capture | Google Sheets via service account | Owner's choice. No CRM yet. Schema designed to also POST to an `AGENT_WEBHOOK_URL` (empty by default) so agents can subscribe later without code changes. |
| Transactional email | Resend | Internal lead notification + branded auto-reply to the lead. |
| Spam controls | Honeypot + Cloudflare Turnstile + IP rate limit | Layered, free, invisible to humans. |
| Hosting | Vercel | Free tier, zero-config Next.js, ISR works natively, preview URLs per branch. |
| Analytics | Vercel Analytics | Privacy-friendly, no consent banner needed. |
| Error monitoring | None in v1 | Skip until justified. |

---

## 3. Information Architecture

### Routes

```
/                              Home
/catalog                       Category index
/catalog/[category]            Category page
/catalog/[category]/[product]  Product detail
/gallery                       Lifestyle inspiration gallery
/quote                         Multi-step quote-request form
/quote/thanks                  Post-submit confirmation
/contact                       Light contact page
/privacy                       Stub legal page
/terms                         Stub legal page
/studio                        Sanity Studio (auth-gated, excluded from sitemap)
/api/lead                      POST: validate, Sheets append, email, optional agent webhook
/api/revalidate                POST: Sanity webhook target for ISR
```

### No dedicated About page

Trust copy ("our process", "quality assurance") lives as a section on Home (`/#process`). Saves a dead page, keeps trust content where buyers actually scroll.

### Global navigation

Sticky header: logo · Catalog · Gallery · Contact · primary **"Request a Quote"** CTA (champagne gold).
Footer: full sitemap, service-area line ("Shipping across Canada"), Privacy/Terms stubs, social handles, email, phone.

### Catalog category seed list (10 categories, ~2 products each = 20 products for v1)

1. Chiavari Chairs
2. Banquet Tables
3. Chair Covers & Sashes
4. Linens
5. Charger Plates
6. Centerpieces & Florals
7. Stage & Backdrop
8. Dishes & Glassware
9. Event Lighting
10. Pipe & Drape

### SEO baseline

- Dynamic `<title>` and meta description per route, driven by Sanity `seo` field on category/product or page-level defaults.
- JSON-LD `Organization` schema on every page (sitewide), `Product` schema on product detail, `BreadcrumbList` on catalog routes.
- `sitemap.xml` and `robots.txt` generated at build via `next-sitemap`. `robots.txt` disallows `/studio` and `/api/*`.
- No programmatic city pages in v1 — defer until the site has earned brand-name ranking and backlinks.

---

## 4. Sanity Data Model

Six schemas. Everything else (taxonomy, filters, search, related products) derives from these.

### `category`

```ts
{
  title: string                    // required
  slug: { current: string }        // required, unique
  tagline: string                  // 1-line lead for category page
  description: PortableText        // rich text
  heroImage: image                 // required, hotspot enabled
  order: number                    // controls grid position on /catalog
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: image
  }
}
```

### `product`

```ts
{
  title: string                    // required
  slug: { current: string }        // required, unique
  category: reference -> category  // required
  shortDescription: string         // 1-2 sentences, for cards
  description: PortableText        // rich text, for detail page
  images: image[]                  // min 1, max 8, hotspot enabled
  specs: { label: string, value: string }[]
  tags: string[]                   // e.g. "gold", "stackable", "outdoor"
  featured: boolean                // surfaces on home
  internalNotes: text              // private, not rendered
  seo: { metaTitle, metaDescription, ogImage }
}
```

**No price field. No MOQ field. No SKU on the public product.** All commercial info is quote-driven.

### `galleryItem`

```ts
{
  title: string                    // optional
  image: image                     // required, hotspot enabled
  tags: string[]                   // "wedding" | "corporate" | "outdoor" | "ballroom" | etc.
  featured: boolean
  order: number
}
```

### `testimonial`

```ts
{
  quote: text
  attribution: string
  venue: string                    // optional
  published: boolean               // default false — site only renders published ones
}
```

Empty in v1. Schema exists so when real testimonials land, no code change is required.

### `siteSettings` (singleton)

```ts
{
  phone: string
  email: string
  serviceAreaCopy: string          // e.g. "Shipping across Canada"
  legalAddress: PortableText       // optional
  socialHandles: { platform: string, url: string }[]
  defaultOgImage: image
  headerCtaLabel: string           // default "Request a Quote"
}
```

### `legalPage`

```ts
{
  title: string
  slug: { current: string }        // "privacy" | "terms"
  body: PortableText
  lastUpdated: datetime
}
```

### Type generation

`sanity typegen generate` produces `sanity.types.ts` consumed by the Next.js side. Pages never type-cast Sanity responses — they import generated types.

### Image delivery

All images flow through `@sanity/image-url`. Pages request transformed URLs per viewport via Next.js `<Image>` component pointing at Sanity's CDN. Format negotiation (WebP / AVIF) is automatic. This obviates the originally-requested "AI image enhancement pipeline" until real low-resolution supplier photos enter the system — at which point we add a one-time bulk-upscale step before ingestion, not a runtime pipeline.

---

## 5. Page Composition

### Home (`/`)

1. **Hero** — fullscreen ballroom image with slow Ken Burns drift. H1 + sub-headline + primary CTA. Eyebrow line above H1.
2. **Category grid** — 10 category tiles, 2×5 or 3×4 responsive. Each tile = image + title + tagline.
3. **Featured products** — horizontal carousel of `featured: true` products, max 8.
4. **Process / QA strip** — anchored at `#process`. Three columns: "We Source", "We Verify", "We Deliver". Trust copy.
5. **Gallery teaser** — 6 lifestyle shots, link to `/gallery`.
6. **Final CTA band** — full-bleed dark section, headline + "Request a Quote in 24 hours" CTA.
7. **Footer.**

### Category page (`/catalog/[category]`)

Breadcrumb → category tagline + hero image → optional filter chips (from product `tags`) → product grid → cross-sell strip ("you might also need…", surfaces 3 products from sibling categories) → final quote CTA.

### Product detail (`/catalog/[category]/[product]`)

Breadcrumb → two-column layout: sticky image gallery (left, lightbox-enabled) + spec sheet (right, with primary "Request a Quote" CTA that prefills `?product=<slug>` on `/quote`) → long description below → related products (same category, exclude self, limit 4) → footer CTA.

### Gallery (`/gallery`)

Masonry grid, tag filter chips, lightbox on click. Lightbox includes a small "Request similar setup" link that prefills the quote form's `notes` field with the gallery item title.

### Quote (`/quote`)

Three-step progressive form, single page, Framer Motion transitions between steps. Step index lives in URL search params (`?step=1`) so the back button works between steps; field values are held in form state and persisted to `sessionStorage` per-field so an accidental refresh doesn't wipe what's typed. Submit on step 3.

**Step 1 — Event basics:** event type (select), event date (date or "TBD"), headcount (number), delivery city (text with autocomplete on top 20 CA metros), province (select).

**Step 2 — Product interest:** categories needed (multiselect chips), specific products (optional — prefilled from `?product=`), budget range (select: <$5k / $5–15k / $15–50k / $50k+ / Not sure), need-by date (date or "Flexible").

**Step 3 — Contact:** full name (required), company/venue (required), email (required + validated), phone (required + CA format), notes (textarea), consent checkbox.

### Quote thanks (`/quote/thanks`)

Confirmation copy, expected response time (24 hours), link back to gallery and home.

### Contact (`/contact`)

Light form: name, email, message. Plus phone, email, service-area line. Posts to the same `/api/lead` route with `source: "contact"`.

### Legal stubs (`/privacy`, `/terms`)

Rendered from `legalPage` Sanity docs. Stub copy in v1; replace before promoting to live.

---

## 6. Visual Design System

### Palette — Noir + Champagne

| Token | Hex | Use |
|---|---|---|
| `bg.canvas` | `#0E0B0A` | Soft black — primary background |
| `bg.elevated` | `#161210` | Cards, modals, elevated surfaces |
| `ink.primary` | `#F5EFE6` | Cream — main text |
| `ink.muted` | `#A89B8C` | Secondary text, captions |
| `brand.gold` | `#C8A24A` | Champagne gold — CTAs, accents, dividers |
| `brand.gold-soft` | `#E4C97A` | Hover state on gold |
| `state.line` | `#2A211C` | Hairline borders |

No oxblood. No secondary accent. Discipline is the design.

### Typography

- **Display:** Cormorant Garamond, weights 400 and 600.
- **Body:** Inter, weights 400 / 500 / 600.
- Loaded via `next/font` for zero CLS and self-hosted delivery.

**Scale:**
- H1 — 72px / Cormorant 600 / tracking -0.02
- H2 — 48px / Cormorant 600
- H3 — 28px / Inter 600
- Body — 17px / Inter 400 / leading 1.6
- Eyebrow — 12px / Inter 500 / tracking 0.18 / uppercase

### Layout

12-column grid. 1280px max content width. Spacing scale: 8, 16, 24, 32, 48, 64, 96, 128. Generous whitespace by default — luxury reads as breathing room, not density.

### Motion language (Framer Motion)

- Hero: slow Ken Burns drift on hero image — 15s loop, scale 1 → 1.05.
- Reveal-on-scroll: 16px fade-up, 600ms, ease-out, staggered children at 80ms intervals.
- Hover on product/category cards: image scales 1.03, champagne-gold underline draws under the title, 250ms.
- Form step transitions: horizontal slide, 400ms, ease-in-out.
- **No** parallax. **No** bounce springs. **No** aggressive entrance animations. Restraint is the point.
- Respect `prefers-reduced-motion`: disable Ken Burns and stagger, retain instantaneous fade.

### Components (shadcn-based, restyled to the palette)

- **Button** — three variants: `primary` (gold fill on canvas), `ghost` (gold border, transparent), `link` (cream text, gold underline on hover).
- **Card** — used for product, category, gallery item. Variant prop controls aspect ratio + overlay treatment.
- **Lightbox** — for gallery and product image zoom. Keyboard navigable, ESC to close.
- **Form primitives** — input, textarea, select, multiselect-with-chips, date picker. All states (default, focus, error, disabled) styled in one place.

---

## 7. Lead Capture Pipeline

### Flow

```
Browser POST /api/lead  (JSON body)
  │
  ▼
Server route (Next.js Node runtime, not edge — needs google-auth-library)
  1. Validate payload with Zod
  2. Reject if honeypot field "website" is non-empty
  3. Verify Cloudflare Turnstile token (server-to-server)
  4. Rate-limit by IP: max 3 submissions / hour (in-memory LRU for v1)
  5. Append a row to Google Sheet via service account
  6. Send Resend email — internal lead summary to LEAD_NOTIFY_EMAIL (fired for both `source: "quote"` and `source: "contact"`)
  7. Send Resend email — branded auto-reply to the lead (template varies by `source`: quote auto-reply promises a 24-hour response with quote details; contact auto-reply is a short generic acknowledgement)
  8. If AGENT_WEBHOOK_URL is set, POST the validated payload to it (fire-and-forget, 3s timeout, errors logged not thrown)
  9. Return 200, client redirects to /quote/thanks
```

### Sheet schema (column order)

```
timestamp | source | name | company | email | phone |
event_type | event_date | headcount | city | province |
categories | products | budget | need_by | notes |
utm_source | utm_medium | utm_campaign | ip_country
```

`source` distinguishes quote-form submissions (`"quote"`) from contact-form submissions (`"contact"`).

### One-time Google Sheets setup (documented in `docs/sops/sheets-setup.md`)

1. Create the sheet "Maison Banquet — Leads".
2. Add the header row (above).
3. Create a GCP service account, generate a JSON key.
4. Share the sheet with the service account email as Editor.
5. Base64-encode the JSON key, store as `GOOGLE_SERVICE_ACCOUNT_JSON` env var (single line).

### Spam controls

| Layer | What | Why |
|---|---|---|
| Honeypot | Hidden `website` field — bots fill it, humans don't | Catches the majority for $0 |
| Cloudflare Turnstile | Invisible captcha, free | Catches what the honeypot misses |
| Rate limit | 3 / hour / IP, in-memory LRU | Cheap, kicks abuse to the curb |

If abuse appears at scale, swap the in-memory LRU for Upstash Redis. No code change beyond the limiter module.

### Agent-ready hook

`AGENT_WEBHOOK_URL` env var, empty in v1. When the owner builds the lead-handling agent later, they set the URL and submissions automatically POST there with the same validated payload as the Sheet row. The site does not change.

---

## 8. Performance, SEO, and Operations

### Performance budget

- LCP < 2.0s on a simulated 4G connection
- CLS < 0.05
- INP < 200ms
- Lighthouse Performance score ≥ 95 on Home and Product Detail
- Hero image preloaded via `<link rel="preload" as="image">`
- Fonts via `next/font` with `display: swap`
- App Router route-segment code splitting (default behavior — do not break it)
- Images use `<Image>` with explicit `sizes`, served from Sanity CDN

### SEO

- Server-rendered HTML on every public route — no client-only content for crawlers
- Per-route `<title>` and meta description from Sanity `seo` fields with sane fallbacks
- Open Graph + Twitter card metadata on every public route
- JSON-LD `Organization` sitewide, `Product` on product detail, `BreadcrumbList` on catalog routes
- `sitemap.xml` generated at build via `next-sitemap`
- `robots.txt` allows public routes, disallows `/studio` and `/api/*`
- Canonical URLs set per route

### Environments

One Vercel project, two environments:
- **Production** — `main` branch, custom domain when attached
- **Preview** — every PR + non-main branch, gets a unique Vercel URL

Sanity dataset is `production` for v1. (No `staging` dataset until content workflow demands it.)

### Required secrets

| Env var | Used by | Notes |
|---|---|---|
| `SANITY_PROJECT_ID` | Both site + Studio | Public-safe |
| `SANITY_DATASET` | Both | `production` |
| `SANITY_API_READ_TOKEN` | Site (server) | For ISR fetches with draft/preview support; not exposed to browser |
| `SANITY_WEBHOOK_SECRET` | `/api/revalidate` | Validates webhook signature |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | `/api/lead` | Base64-encoded service-account JSON |
| `GOOGLE_SHEET_ID` | `/api/lead` | Target sheet |
| `RESEND_API_KEY` | `/api/lead` | Email sender |
| `LEAD_NOTIFY_EMAIL` | `/api/lead` | Internal notify destination — defaults to owner's email |
| `TURNSTILE_SITE_KEY` | Browser (form) | Public |
| `TURNSTILE_SECRET_KEY` | `/api/lead` | Server-side verification |
| `AGENT_WEBHOOK_URL` | `/api/lead` | Optional, empty in v1 |

### Domain status

No domain in v1. Site deploys to a Vercel preview URL (e.g. `maison-banquet.vercel.app`). Owner registers and attaches a real domain before promotion. Domain choice is a one-time owner task, not a build dependency.

### Analytics

Vercel Analytics enabled at the project level. No Google Analytics, no Meta Pixel in v1.

### Memory entry

After spec approval, `memory/project_banquet_import_site.md` will be added to the user's auto-memory, pointing at this spec and the project folder, so future sessions auto-load context.

---

## 9. Explicit Out-of-Scope (v2+)

These are listed not to be forgotten but to be **deliberately excluded** from v1. Adding them now would dilute the focus.

| Deferred | Why deferred | Revisit when |
|---|---|---|
| AI chatbot | No FAQ corpus, would hallucinate | After 30 days of real quote questions inform an FAQ |
| AI quote assistant | Needs real conversation data | Sheets has 50+ leads |
| AI product recommendation | 20 products doesn't justify ML | 100+ products |
| Programmatic SEO city pages | Doesn't move needle without backlinks | After v1 is indexed and ranking for brand name |
| Blog / SEO content hub | Architecture is trivially addable; defer until content cadence exists | Owner commits to publishing |
| WhatsApp integration | Adds moderation surface owner can't staff yet | Post-launch |
| Image enhancement pipeline | Sanity CDN already does WebP/AVIF/responsive | Real low-res supplier photos enter the system |
| E-commerce / Stripe checkout | B2B inquiry-driven is correct for v1 | Year 2, once converting SKUs are known |
| Multilingual (FR) | Architecture supports it; no copy yet | Quebec push |
| Inventory tracking, supplier mgmt | Pre-revenue | After first 10 shipments |

---

## 10. Architectural Boundaries (so units stay small and testable)

The site is decomposed into modules with explicit interfaces. Pages compose these — they don't reach inside.

- **`lib/sanity/client.ts`** — Sanity client + image-url builder. Single source of network access to Sanity.
- **`lib/sanity/queries.ts`** — typed GROQ queries (`getCategories`, `getCategory(slug)`, `getProduct(category, slug)`, `getFeaturedProducts`, `getGalleryItems(tag?)`, `getSiteSettings`). Pages call these — they don't write GROQ inline.
- **`lib/leads/submit.ts`** — server-only module that takes a validated `LeadPayload`, performs Sheet append + emails + optional webhook. Idempotent best-effort; partial failures logged, do not block response.
- **`lib/leads/schema.ts`** — Zod schemas for `QuotePayload` and `ContactPayload`, plus narrowed `LeadPayload` union. Single source of truth for what a lead looks like.
- **`lib/brand.ts`** — placeholder brand identity (name, tagline, social handles fallback, voice copy snippets). Swap-point for the real brand when ready.
- **`lib/seo/metadata.ts`** — helpers that turn Sanity `seo` fields into Next.js `Metadata` objects with fallbacks.
- **`components/`** — presentational only. No data fetching. No business logic.
- **`app/api/lead/route.ts`** — thin HTTP boundary: parse → validate → call `lib/leads/submit.ts` → respond. ~30 lines.
- **`app/api/revalidate/route.ts`** — thin HTTP boundary: validate Sanity webhook signature → call `revalidateTag` / `revalidatePath`.
- **`studio/`** — Sanity Studio configuration; schemas live in `studio/schemas/`.

Boundary tests: pages must not import from `lib/leads/submit.ts` (lead submission is server-only and behind `/api/lead`); browser code must not import from any `*/server.ts` file; Studio code is independently buildable.

---

## 11. Documentation & SOP Deliverables

Alongside the code:

- `README.md` — local dev setup, env vars, deploy
- `docs/sops/sheets-setup.md` — one-time Google Sheets + service account setup
- `docs/sops/sanity-setup.md` — one-time Sanity project + Studio setup
- `docs/sops/resend-setup.md` — one-time Resend + domain verification setup
- `docs/sops/turnstile-setup.md` — one-time Cloudflare Turnstile setup
- `docs/sops/deploy-to-vercel.md` — Vercel project creation + env var wiring + domain attachment
- `docs/sops/promote-to-live.md` — the swap-placeholder-brand-and-attach-domain checklist
- `docs/sops/add-product.md` — how to add a product via Sanity Studio (for future non-technical helpers)

These are part of v1, not afterthoughts. The "demo that becomes production" thesis fails without them.

---

## 12. Success Criteria

V1 is done when:

1. All 4 routes (Home, Catalog tree, Gallery, Quote) render with real Sanity content.
2. 10 categories and 20 products are seeded in Sanity.
3. 30+ gallery items are seeded from Pexels.
4. A submitted quote form lands a row in the Google Sheet AND fires both Resend emails.
5. Lighthouse Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 100 on Home and a Product Detail page.
6. The site deploys cleanly to Vercel preview with all env vars wired.
7. All SOPs in Section 11 exist and are correct (verified by running through them on a fresh machine, even if mentally).
8. The owner can add a new product via `/studio` without touching code.
9. `robots.txt` blocks `/studio` and `/api/*`; `sitemap.xml` includes every public route.
10. A memory entry pointing at this project exists at `memory/project_banquet_import_site.md`.
