# Maison Banquet Co. — Website v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a luxury B2B marketing site for Maison Banquet Co. — Sanity-driven catalog, Pexels-curated visuals, Google-Sheets lead capture, agent-ready data layer — deployable to Vercel preview from day one.

**Architecture:** Next.js 15 (App Router) + Tailwind v4 + Framer Motion + shadcn-style primitives restyled to a Noir + Champagne palette. Sanity v3 CMS with embedded Studio at `/studio`. Lead capture posts to Google Sheets via service account, sends two Resend emails (internal + auto-reply), and optionally fires an `AGENT_WEBHOOK_URL`. All public routes server-rendered with JSON-LD. Deploys to Vercel free tier.

**Tech Stack:** Next.js 15 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Sanity v3 · Zod · Resend · googleapis · Cloudflare Turnstile · Vitest · Playwright · next-sitemap.

**Spec:** [2026-05-19-maison-banquet-website-design.md](../specs/2026-05-19-maison-banquet-website-design.md)

**Project root for all paths below:** `projects/banquet-import-site/`

---

## File Structure

```
projects/banquet-import-site/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── .env.example
├── .env.local                                          (git-ignored)
├── next-sitemap.config.js
├── vitest.config.ts
├── playwright.config.ts
├── public/
│   ├── favicon.ico
│   └── og-default.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx                                  Root layout, fonts, header/footer
│   │   ├── page.tsx                                    Home
│   │   ├── globals.css                                 Tailwind directives + base layer
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── catalog/
│   │   │   ├── page.tsx                                Category index
│   │   │   └── [category]/
│   │   │       ├── page.tsx                            Category page
│   │   │       └── [product]/page.tsx                  Product detail
│   │   ├── gallery/page.tsx
│   │   ├── quote/
│   │   │   ├── page.tsx                                3-step quote form
│   │   │   └── thanks/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── studio/[[...index]]/page.tsx                Embedded Sanity Studio
│   │   └── api/
│   │       ├── lead/route.ts                           POST: validate, Sheets, emails, webhook
│   │       └── revalidate/route.ts                     POST: Sanity webhook target
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── chip.tsx
│   │   │   └── dialog.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── motion/reveal.tsx
│   │   ├── home/{hero,category-grid,featured-products,process-strip,gallery-teaser,cta-band}.tsx
│   │   ├── catalog/{category-card,product-card,product-gallery,spec-sheet,filter-chips}.tsx
│   │   ├── gallery/{masonry-grid,lightbox}.tsx
│   │   ├── quote/{quote-form,step-event,step-product,step-contact,turnstile}.tsx
│   │   └── seo/{json-ld,organization-jsonld}.tsx
│   ├── lib/
│   │   ├── brand.ts
│   │   ├── utils.ts
│   │   ├── sanity/{client,image,queries}.ts
│   │   ├── leads/{schema,submit,sheets,emails,webhook,turnstile}.ts
│   │   ├── rate-limit.ts
│   │   └── seo/metadata.ts
│   ├── studio/
│   │   ├── sanity.config.ts
│   │   └── schemas/
│   │       ├── index.ts
│   │       ├── objects/{seo,spec}.ts
│   │       └── {category,product,galleryItem,testimonial,siteSettings,legalPage}.ts
│   └── types/sanity.generated.ts                       Generated
├── tests/
│   ├── unit/{brand,leads-schema,leads-sheets,leads-emails,leads-webhook,leads-turnstile,leads-submit,rate-limit,sanity-image,seo-metadata}.test.ts
│   └── e2e/{home,catalog,gallery,quote-form,contact-form}.spec.ts
├── seed/
│   ├── seed-sanity.ts
│   ├── categories.json
│   ├── products.json
│   └── gallery-pexels.json
└── docs/
    ├── superpowers/
    │   ├── specs/2026-05-19-maison-banquet-website-design.md
    │   └── plans/2026-05-19-maison-banquet-website.md
    └── sops/
        ├── sanity-setup.md
        ├── sheets-setup.md
        ├── resend-setup.md
        ├── turnstile-setup.md
        ├── deploy-to-vercel.md
        ├── promote-to-live.md
        └── add-product.md
```

**Boundaries enforced by the plan:**
- `src/components/` are presentational only — they receive data via props, do not fetch.
- `src/lib/sanity/queries.ts` is the only file that writes GROQ. Pages call query functions.
- `src/lib/leads/submit.ts` is server-only. Browser must not import it.
- `src/lib/brand.ts` is the single swap-point for placeholder → real brand.

**Conventions for every task:**
- Run commands from the project root (`projects/banquet-import-site/`) unless stated.
- Windows + PowerShell host — but use cross-platform npm scripts; no PowerShell-only commands inside tasks.
- All TypeScript code uses `import type` for type-only imports.
- `next dev` runs on port 3000.
- One commit per task, conventional-commits style.

---

## Phase Map

- **Phase A — Foundation** (Tasks 1-8): scaffold, deps, tooling, first passing test
- **Phase B — Sanity** (Tasks 9-15): project, schemas, type generation, client, queries
- **Phase C — Brand + design system** (Tasks 16-21): brand module, palette, fonts, primitives, motion
- **Phase D — Layout** (Tasks 22-25): root layout, header, footer, legal stubs
- **Phase E — Home** (Tasks 26-32): hero through CTA band, full Home page composition
- **Phase F — Catalog** (Tasks 33-38): cards, category index, category page, product detail
- **Phase G — Gallery** (Tasks 39-40): masonry, lightbox, /gallery page
- **Phase H — Lead pipeline** (Tasks 41-49): Zod, Turnstile, rate limit, Sheets, emails, webhook, submit, /api/lead
- **Phase I — Forms** (Tasks 50-53): form primitives, quote form, contact form, thanks page
- **Phase J — SEO + revalidate** (Tasks 54-58): metadata helper, sitemap, robots, JSON-LD, /api/revalidate
- **Phase K — Seed + E2E + perf** (Tasks 59-62): seed content, Playwright suite, Lighthouse gate
- **Phase L — Deploy + SOPs + memory** (Tasks 63-70): Vercel, all SOPs, memory entry

---

## Phase A — Foundation

### Task 1: Initialize Next.js project

**Files:**
- Create: `projects/banquet-import-site/package.json` (via scaffolder)
- Create: `projects/banquet-import-site/tsconfig.json`
- Create: `projects/banquet-import-site/next.config.ts`
- Create: `projects/banquet-import-site/.gitignore`

- [ ] **Step 1: Run create-next-app**

From `projects/`:

```bash
npx create-next-app@latest banquet-import-site --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --use-npm
```

Accept Turbopack if prompted.

- [ ] **Step 2: Verify the dev server runs**

```bash
cd banquet-import-site
npm run dev
```

Expected: `▲ Next.js 15.x.x  -  Local:  http://localhost:3000`. Open the URL, confirm the default page loads. Ctrl+C to stop.

- [ ] **Step 3: Initialize git and first commit**

```bash
git init
git add .
git commit -m "chore: scaffold next.js project for banquet-import-site"
```

---

### Task 2: Strict TypeScript

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Replace tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npx tsc --noEmit
```

Expected: exit code 0, no output.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: enable strict typescript with noUncheckedIndexedAccess"
```

---

### Task 3: ESLint + Prettier

**Files:**
- Create: `eslint.config.mjs`
- Create: `.prettierrc`
- Modify: `package.json`

- [ ] **Step 1: Install tooling**

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-config-next eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier
```

- [ ] **Step 2: Write eslint.config.mjs**

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }]
    }
  }
];
```

- [ ] **Step 3: Write .prettierrc**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

- [ ] **Step 4: Add scripts to package.json**

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 5: Verify lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add eslint.config.mjs .prettierrc package.json package-lock.json
git commit -m "chore: configure eslint, prettier, and tooling scripts"
```

---

### Task 4: Vitest setup

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/unit/sanity.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest @vitest/coverage-v8 @vitejs/plugin-react happy-dom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Write vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    globals: false,
    coverage: { provider: "v8", reporter: ["text", "html"] },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 3: Add scripts**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Smoke test**

`tests/unit/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("environment sanity", () => {
  it("runs vitest", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run, verify pass**

```bash
npm test
```

Expected: 1 passed.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts package.json package-lock.json tests/
git commit -m "chore: add vitest + happy-dom with a smoke test"
```

---

### Task 5: Playwright setup

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/home.spec.ts`
- Modify: `package.json`, `.gitignore`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Write playwright.config.ts**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Append to .gitignore**

```
/test-results/
/playwright-report/
/playwright/.cache/
```

- [ ] **Step 4: Add script**

```json
"test:e2e": "playwright test"
```

- [ ] **Step 5: Smoke e2e**

`tests/e2e/home.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
});
```

- [ ] **Step 6: Run, verify pass**

```bash
npm run test:e2e
```

Expected: 1 passed.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts tests/e2e package.json package-lock.json .gitignore
git commit -m "chore: add playwright with chromium and home smoke e2e"
```

---

### Task 6: Environment variable scaffolding

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Verify .env.local is git-ignored**

```bash
grep -E "\.env" .gitignore
```

Expected output contains `.env*` or similar. If not, append `.env*.local`.

- [ ] **Step 2: Write .env.example**

```bash
# --- Sanity ---
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_WEBHOOK_SECRET=

# --- Google Sheets (server-side lead capture) ---
# Base64-encoded service account JSON (single line)
GOOGLE_SERVICE_ACCOUNT_JSON=
GOOGLE_SHEET_ID=

# --- Resend (transactional email) ---
RESEND_API_KEY=
LEAD_NOTIFY_EMAIL=hardeep.singh@futurewavesol.com
LEAD_FROM_EMAIL="Maison Banquet <noreply@maisonbanquet.example>"

# --- Cloudflare Turnstile (spam) ---
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# --- Agent-ready webhook (optional, empty in v1) ---
AGENT_WEBHOOK_URL=
```

- [ ] **Step 3: Copy to .env.local for local dev**

PowerShell: `Copy-Item .env.example .env.local`
Bash: `cp .env.example .env.local`

- [ ] **Step 4: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: scaffold env vars in .env.example"
```

---

### Task 7: Tailwind v4 brand tokens + base layer

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace src/app/globals.css**

```css
@import "tailwindcss";

@theme {
  --color-bg-canvas: #0E0B0A;
  --color-bg-elevated: #161210;
  --color-ink-primary: #F5EFE6;
  --color-ink-muted: #A89B8C;
  --color-brand-gold: #C8A24A;
  --color-brand-gold-soft: #E4C97A;
  --color-state-line: #2A211C;

  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --tracking-display: -0.02em;
  --tracking-eyebrow: 0.18em;

  --container-default: 1280px;
}

@layer base {
  html {
    background: var(--color-bg-canvas);
    color: var(--color-ink-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  body { min-height: 100dvh; }
  ::selection { background: var(--color-brand-gold); color: var(--color-bg-canvas); }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
}
```

- [ ] **Step 2: Visually verify**

```bash
npm run dev
```

Open `http://localhost:3000` — background should be near-black, text cream. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: noir + champagne palette via tailwind v4 theme"
```

---

### Task 8: Brand module (TDD)

**Files:**
- Test: `tests/unit/brand.test.ts`
- Create: `src/lib/brand.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { brand } from "@/lib/brand";

describe("brand module", () => {
  it("exposes a placeholder name and tagline", () => {
    expect(brand.name).toBe("Maison Banquet Co.");
    expect(brand.tagline.length).toBeGreaterThan(0);
  });
  it("exposes a service area copy line referencing Canada", () => {
    expect(brand.serviceArea).toMatch(/Canada/i);
  });
  it("flags itself as placeholder", () => {
    expect(brand.isPlaceholder).toBe(true);
  });
  it("exposes a default CTA label mentioning Quote", () => {
    expect(brand.ctaPrimary).toMatch(/Quote/i);
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module '@/lib/brand'`.

- [ ] **Step 3: Implement**

`src/lib/brand.ts`:

```ts
export const brand = {
  name: "Maison Banquet Co.",
  tagline: "Luxury banquet furnishings, imported with intent.",
  serviceArea: "Shipping across Canada",
  ctaPrimary: "Request a Quote",
  ctaSecondary: "View Catalog",
  email: "hello@maisonbanquet.example",
  phone: "+1 (000) 000-0000",
  isPlaceholder: true,
} as const;

export type Brand = typeof brand;
```

- [ ] **Step 4: Run, verify pass**

```bash
npm test
```

Expected: all passed (smoke + 4 brand tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/brand.ts tests/unit/brand.test.ts
git commit -m "feat(brand): placeholder identity module with swap-point flag"
```

---

## Phase B — Sanity CMS

### Task 9: Create Sanity project (manual step + env capture)

**Files:**
- Modify: `.env.local`
- Create: `docs/sops/sanity-setup.md` (initial draft; expanded in Phase L)

This task includes a one-time manual setup in the Sanity dashboard. Document it as you go.

- [ ] **Step 1: Create the Sanity project**

Run in the project root:

```bash
npx --yes create-sanity@latest --project-name="Maison Banquet" --dataset=production --output-path=tmp-sanity --typescript --template clean
```

Select "Create new project" when prompted. Log in via browser when the CLI opens it. Capture the resulting **project ID** (shown in CLI output).

- [ ] **Step 2: Capture project ID and dataset to .env.local**

Edit `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<paste project id from Step 1>
NEXT_PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 3: Create a read-token**

Open `https://www.sanity.io/manage` → your project → API → Tokens → **Add API token** → name `site-read`, permissions: **Viewer**. Copy the token immediately (only shown once).

```
SANITY_API_READ_TOKEN=<paste read token>
```

- [ ] **Step 4: Discard the throwaway scaffold**

```bash
rm -rf tmp-sanity
```

PowerShell: `Remove-Item -Recurse -Force tmp-sanity`

- [ ] **Step 5: Draft SOP**

`docs/sops/sanity-setup.md`:

```markdown
# Sanity Setup — One-Time

1. `npx --yes create-sanity@latest --output-path=tmp-sanity --typescript --template clean` (any name)
2. Choose "Create new project", login via browser.
3. Note the project ID — set as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
4. Dataset stays `production` — set as `NEXT_PUBLIC_SANITY_DATASET`.
5. https://www.sanity.io/manage → API → Tokens → Add (Viewer) → copy → set as `SANITY_API_READ_TOKEN`.
6. Discard the `tmp-sanity` scaffold — schemas live in `src/studio/`.
```

- [ ] **Step 6: Commit**

```bash
git add docs/sops/sanity-setup.md
git commit -m "docs(sop): sanity project setup"
```

(Do NOT commit `.env.local`.)

---

### Task 10: Install Sanity dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install sanity @sanity/vision @sanity/image-url next-sanity
npm install -D sanity-codegen
```

- [ ] **Step 2: Verify typecheck still passes**

```bash
npm run typecheck
```

Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(sanity): install sanity v3, image-url, next-sanity"
```

---

### Task 11: Studio config (embedded at /studio)

**Files:**
- Create: `src/studio/sanity.config.ts`
- Create: `src/studio/schemas/index.ts`
- Create: `src/app/studio/[[...index]]/page.tsx`

- [ ] **Step 1: Empty schema registry**

`src/studio/schemas/index.ts`:

```ts
import type { SchemaTypeDefinition } from "sanity";

export const schemaTypes: SchemaTypeDefinition[] = [];
```

- [ ] **Step 2: Studio config**

`src/studio/sanity.config.ts`:

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export default defineConfig({
  name: "maison-banquet-studio",
  title: "Maison Banquet Studio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
```

- [ ] **Step 3: Studio route**

`src/app/studio/[[...index]]/page.tsx`:

```tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/studio/sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 4: Run dev, visit /studio**

```bash
npm run dev
```

Open `http://localhost:3000/studio`. Expected: Studio loads, prompts login (first-time only), shows empty Studio with Vision tool. Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/studio src/app/studio
git commit -m "feat(sanity): embed studio at /studio with empty schema"
```

---

### Task 12: Shared SEO + spec object schemas

**Files:**
- Create: `src/studio/schemas/objects/seo.ts`
- Create: `src/studio/schemas/objects/spec.ts`
- Modify: `src/studio/schemas/index.ts`

- [ ] **Step 1: seo object**

`src/studio/schemas/objects/seo.ts`:

```ts
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", title: "Meta Title", type: "string", validation: (r) => r.max(60) }),
    defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 2, validation: (r) => r.max(160) }),
    defineField({ name: "ogImage", title: "OG Image", type: "image", options: { hotspot: true } }),
  ],
});
```

- [ ] **Step 2: spec object**

`src/studio/schemas/objects/spec.ts`:

```ts
import { defineField, defineType } from "sanity";

export const spec = defineType({
  name: "spec",
  title: "Spec",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { label: "label", value: "value" },
    prepare: ({ label, value }) => ({ title: label, subtitle: value }),
  },
});
```

- [ ] **Step 3: Register both**

`src/studio/schemas/index.ts`:

```ts
import type { SchemaTypeDefinition } from "sanity";
import { seo } from "./objects/seo";
import { spec } from "./objects/spec";

export const schemaTypes: SchemaTypeDefinition[] = [seo, spec];
```

- [ ] **Step 4: Verify build**

```bash
npm run typecheck
npm run dev
```

Open `/studio` — Studio still loads (no document types yet, just embedded objects). Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/studio/schemas
git commit -m "feat(sanity): seo and spec shared object schemas"
```

---

### Task 13: Document schemas — category, product, galleryItem

**Files:**
- Create: `src/studio/schemas/category.ts`
- Create: `src/studio/schemas/product.ts`
- Create: `src/studio/schemas/galleryItem.ts`
- Modify: `src/studio/schemas/index.ts`

- [ ] **Step 1: category schema**

`src/studio/schemas/category.ts`:

```ts
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", type: "string", description: "One-line lead for category page" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", media: "heroImage" } },
});
```

- [ ] **Step 2: product schema**

`src/studio/schemas/product.ts`:

```ts
import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortDescription", type: "string", validation: (r) => r.max(180) }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.min(1).max(8),
    }),
    defineField({ name: "specs", type: "array", of: [{ type: "spec" }] }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "internalNotes", type: "text", description: "Private — not rendered." }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "images.0" },
  },
});
```

- [ ] **Step 3: galleryItem schema**

`src/studio/schemas/galleryItem.ts`:

```ts
import { defineField, defineType } from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", media: "image" } },
});
```

- [ ] **Step 4: Register**

Replace `src/studio/schemas/index.ts`:

```ts
import type { SchemaTypeDefinition } from "sanity";
import { seo } from "./objects/seo";
import { spec } from "./objects/spec";
import { category } from "./category";
import { product } from "./product";
import { galleryItem } from "./galleryItem";

export const schemaTypes: SchemaTypeDefinition[] = [seo, spec, category, product, galleryItem];
```

- [ ] **Step 5: Verify**

```bash
npm run typecheck
npm run dev
```

Open `/studio` — left sidebar shows Category, Product, Gallery Item. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add src/studio/schemas
git commit -m "feat(sanity): category, product, galleryItem document schemas"
```

---

### Task 14: Remaining schemas — testimonial, siteSettings, legalPage

**Files:**
- Create: `src/studio/schemas/testimonial.ts`
- Create: `src/studio/schemas/siteSettings.ts`
- Create: `src/studio/schemas/legalPage.ts`
- Modify: `src/studio/schemas/index.ts`

- [ ] **Step 1: testimonial**

```ts
import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "attribution", type: "string", validation: (r) => r.required() }),
    defineField({ name: "venue", type: "string" }),
    defineField({ name: "published", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "attribution", subtitle: "quote" } },
});
```

- [ ] **Step 2: siteSettings (singleton)**

```ts
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "serviceAreaCopy", type: "string", initialValue: "Shipping across Canada" }),
    defineField({ name: "legalAddress", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "socialHandles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", type: "string" },
            { name: "url", type: "url" },
          ],
        },
      ],
    }),
    defineField({ name: "defaultOgImage", type: "image" }),
    defineField({ name: "headerCtaLabel", type: "string", initialValue: "Request a Quote" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
```

- [ ] **Step 3: legalPage**

```ts
import { defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "lastUpdated", type: "datetime" }),
  ],
});
```

- [ ] **Step 4: Register all six**

```ts
import type { SchemaTypeDefinition } from "sanity";
import { seo } from "./objects/seo";
import { spec } from "./objects/spec";
import { category } from "./category";
import { product } from "./product";
import { galleryItem } from "./galleryItem";
import { testimonial } from "./testimonial";
import { siteSettings } from "./siteSettings";
import { legalPage } from "./legalPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  seo, spec, category, product, galleryItem, testimonial, siteSettings, legalPage,
];
```

- [ ] **Step 5: Verify in Studio**

```bash
npm run dev
```

Visit `/studio` — sidebar lists all six document types. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add src/studio/schemas
git commit -m "feat(sanity): testimonial, siteSettings, legalPage schemas"
```

---

### Task 15: Sanity client + image-url helper + queries (TDD on image URL)

**Files:**
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/image.ts`
- Create: `src/lib/sanity/queries.ts`
- Test: `tests/unit/sanity-image.test.ts`

- [ ] **Step 1: client.ts**

```ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-01",
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
});
```

- [ ] **Step 2: Failing test for image.ts**

`tests/unit/sanity-image.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";

vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "abc123");
vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");

import { urlFor } from "@/lib/sanity/image";

describe("urlFor", () => {
  it("returns a Sanity CDN URL for a reference", () => {
    const url = urlFor({ _type: "image", asset: { _ref: "image-abc-100x100-jpg" } }).width(800).url();
    expect(url).toContain("https://cdn.sanity.io");
    expect(url).toContain("w=800");
  });

  it("returns null for a falsy input", () => {
    expect(urlFor(null)).toBeNull();
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npm test -- sanity-image
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement image.ts**

```ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanity } from "./client";

const builder = imageUrlBuilder(sanity);

// Accepts `unknown` so components can pass raw Sanity fields without casting.
// Returns null for falsy/invalid inputs; otherwise an image-url builder chain.
export function urlFor(source: unknown) {
  if (!source) return null;
  return builder.image(source as SanityImageSource);
}
```

- [ ] **Step 5: Run, verify pass**

```bash
npm test -- sanity-image
```

Expected: 2 passed.

- [ ] **Step 6: queries.ts**

```ts
import { sanity } from "./client";

const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc) {
  _id, title, "slug": slug.current, tagline, description, heroImage, order, seo
}`;

const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, tagline, description, heroImage, seo,
  "products": *[_type == "product" && references(^._id)] | order(title asc) {
    _id, title, "slug": slug.current, shortDescription, images, tags, featured
  }
}`;

const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $product
  && category->slug.current == $category][0] {
  _id, title, "slug": slug.current, shortDescription, description, images, specs, tags, seo,
  "category": category->{ title, "slug": slug.current }
}`;

const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && featured == true][0...8] {
  _id, title, "slug": slug.current, shortDescription, images,
  "category": category->{ title, "slug": slug.current }
}`;

const GALLERY_QUERY = `*[_type == "galleryItem"] | order(order asc, _createdAt desc) {
  _id, title, image, tags, featured
}`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  phone, email, serviceAreaCopy, legalAddress, socialHandles, defaultOgImage, headerCtaLabel
}`;

const LEGAL_PAGE_QUERY = `*[_type == "legalPage" && slug.current == $slug][0] {
  title, "slug": slug.current, body, lastUpdated
}`;

export async function getCategories() {
  return sanity.fetch(CATEGORIES_QUERY, {}, { next: { revalidate: 60, tags: ["categories"] } });
}
export async function getCategory(slug: string) {
  return sanity.fetch(CATEGORY_BY_SLUG_QUERY, { slug }, {
    next: { revalidate: 60, tags: ["categories", `category:${slug}`] },
  });
}
export async function getProduct(category: string, product: string) {
  return sanity.fetch(PRODUCT_BY_SLUG_QUERY, { category, product }, {
    next: { revalidate: 60, tags: [`product:${product}`] },
  });
}
export async function getFeaturedProducts() {
  return sanity.fetch(FEATURED_PRODUCTS_QUERY, {}, { next: { revalidate: 60, tags: ["featured"] } });
}
export async function getGalleryItems() {
  return sanity.fetch(GALLERY_QUERY, {}, { next: { revalidate: 60, tags: ["gallery"] } });
}
export async function getSiteSettings() {
  return sanity.fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 300, tags: ["siteSettings"] } });
}
export async function getLegalPage(slug: string) {
  return sanity.fetch(LEGAL_PAGE_QUERY, { slug }, {
    next: { revalidate: 300, tags: [`legal:${slug}`] },
  });
}
```

- [ ] **Step 7: Verify typecheck**

```bash
npm run typecheck
npm test
```

Expected: typecheck 0, all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/sanity tests/unit/sanity-image.test.ts
git commit -m "feat(sanity): client, urlFor helper, GROQ query module"
```

---

## Phase C — Brand + Design System

### Task 16: Load Cormorant Garamond + Inter via next/font

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace src/app/layout.tsx**

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { brand } from "@/lib/brand";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-display-loaded",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: brand.name, template: `%s — ${brand.name}` },
  description: brand.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Wire the font CSS variables into the theme**

In `src/app/globals.css`, replace the two `--font-*` declarations inside `@theme`:

```css
  --font-display: var(--font-display-loaded), Georgia, serif;
  --font-sans: var(--font-sans-loaded), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

- [ ] **Step 3: Visually verify**

```bash
npm run dev
```

`http://localhost:3000` should now use Inter for body text. Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat(brand): load Cormorant Garamond + Inter via next/font"
```

---

### Task 17: cn() classnames helper (TDD)

**Files:**
- Test: `tests/unit/utils.test.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Install clsx + tailwind-merge**

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 2: Failing test**

`tests/unit/utils.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges classnames", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npm test -- utils
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement**

`src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Run, verify pass**

```bash
npm test -- utils
```

Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add src/lib/utils.ts tests/unit/utils.test.ts package.json package-lock.json
git commit -m "feat(util): cn() classname merger with tailwind-merge"
```

---

### Task 18: Button primitive

**Files:**
- Create: `src/components/ui/button.tsx`

(No unit test — covered by Playwright in Phase K. We unit-test logic, not presentation.)

- [ ] **Step 1: Install class-variance-authority + radix slot**

```bash
npm install class-variance-authority @radix-ui/react-slot
```

- [ ] **Step 2: Write Button**

`src/components/ui/button.tsx`:

```tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide " +
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[var(--color-brand-gold)] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[var(--color-bg-canvas)] disabled:opacity-50 " +
    "disabled:pointer-events-none uppercase",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-gold)] text-[var(--color-bg-canvas)] " +
          "hover:bg-[var(--color-brand-gold-soft)]",
        ghost:
          "border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] " +
          "hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-bg-canvas)]",
        link:
          "text-[var(--color-ink-primary)] underline-offset-4 " +
          "decoration-[var(--color-brand-gold)] hover:underline normal-case tracking-normal",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-12 px-7 text-sm",
        lg: "h-14 px-9 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
}

// When `asChild` is true, the Button renders as its single child (e.g. <Link>),
// merging styles onto that element instead of wrapping it in a <button>.
// This avoids invalid nested-interactive markup like <button><a>...
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(button({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
```

- [ ] **Step 3: Verify typecheck + build**

```bash
npm run typecheck
npm run lint
```

Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/button.tsx package.json package-lock.json
git commit -m "feat(ui): button primitive with primary/ghost/link variants"
```

---

### Task 19: Form input primitives (Input, Textarea, Select, Checkbox, Chip)

**Files:**
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/checkbox.tsx`
- Create: `src/components/ui/chip.tsx`

- [ ] **Step 1: Input**

`src/components/ui/input.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full bg-transparent border border-[var(--color-state-line)] px-4 text-base",
        "text-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-muted)]",
        "focus-visible:outline-none focus-visible:border-[var(--color-brand-gold)] transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
```

- [ ] **Step 2: Textarea**

`src/components/ui/textarea.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-24 w-full bg-transparent border border-[var(--color-state-line)] px-4 py-3 text-base",
      "text-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-muted)]",
      "focus-visible:outline-none focus-visible:border-[var(--color-brand-gold)] transition-colors",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
```

- [ ] **Step 3: Select**

`src/components/ui/select.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-12 w-full bg-[var(--color-bg-canvas)] border border-[var(--color-state-line)] px-4 text-base",
      "text-[var(--color-ink-primary)] focus-visible:outline-none",
      "focus-visible:border-[var(--color-brand-gold)] transition-colors appearance-none",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
```

- [ ] **Step 4: Checkbox**

`src/components/ui/checkbox.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "h-5 w-5 appearance-none border border-[var(--color-state-line)] cursor-pointer",
      "checked:bg-[var(--color-brand-gold)] checked:border-[var(--color-brand-gold)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]",
      className,
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
```

- [ ] **Step 5: Chip (toggleable multiselect chip)**

`src/components/ui/chip.tsx`:

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center px-4 h-9 text-xs uppercase tracking-wide border transition-colors",
        selected
          ? "bg-[var(--color-brand-gold)] text-[var(--color-bg-canvas)] border-[var(--color-brand-gold)]"
          : "bg-transparent text-[var(--color-ink-primary)] border-[var(--color-state-line)] hover:border-[var(--color-brand-gold)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Chip.displayName = "Chip";
```

- [ ] **Step 6: Verify**

```bash
npm run typecheck
npm run lint
```

Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui
git commit -m "feat(ui): Input, Textarea, Select, Checkbox, Chip primitives"
```

---

### Task 20: Reveal motion primitive

**Files:**
- Create: `src/components/motion/reveal.tsx`

- [ ] **Step 1: Install framer-motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Implement**

`src/components/motion/reveal.tsx`:

```tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  className?: string;
}

export function Reveal({ children, delay = 0, as: Tag = "div", className }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion(Tag) as ReturnType<typeof motion.div>;
  return (
    <Component
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck
npm run lint
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/motion package.json package-lock.json
git commit -m "feat(motion): Reveal wrapper with reduced-motion fallback"
```

---

### Task 21: Container + Eyebrow typography helpers

**Files:**
- Create: `src/components/ui/container.tsx`
- Create: `src/components/ui/eyebrow.tsx`

- [ ] **Step 1: Container**

`src/components/ui/container.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export function Container({ className, narrow, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-10",
        narrow ? "max-w-[720px]" : "max-w-[var(--container-default)]",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Eyebrow**

`src/components/ui/eyebrow.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs uppercase font-medium text-[var(--color-brand-gold)]",
        "tracking-[var(--tracking-eyebrow)]",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/ui
git commit -m "feat(ui): Container and Eyebrow typography helpers"
```

---

## Phase D — Layout

### Task 22: Header component

**Files:**
- Create: `src/components/layout/header.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/catalog", label: "Catalog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-canvas)]/85 backdrop-blur border-b border-[var(--color-state-line)]">
      <Container className="flex items-center justify-between h-20">
        <Link href="/" className="font-[var(--font-display)] text-xl tracking-tight">
          {brand.name}
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wide text-[var(--color-ink-primary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/quote">{brand.ctaPrimary}</Link>
          </Button>
        </nav>
        <button
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[var(--color-ink-primary)]"
        >
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current" />
        </button>
      </Container>
      {open && (
        <Container className="md:hidden pb-6 flex flex-col gap-4">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm uppercase">
              {item.label}
            </Link>
          ))}
          <Link href="/quote" onClick={() => setOpen(false)} className="text-sm uppercase text-[var(--color-brand-gold)]">
            {brand.ctaPrimary}
          </Link>
        </Container>
      )}
    </header>
  );
}
```

Note the `<Button>` here renders a styled wrapper; if shadcn-style `asChild` isn't needed, plain anchor styling inside Button is fine. The plan above wraps a `<Link>` inside the button element — for Task 22 keep it as-is (button with link child) and adjust to a styled `<Link>` later if accessibility flags it.

- [ ] **Step 2: Verify**

```bash
npm run typecheck && npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat(layout): sticky header with mobile menu"
```

---

### Task 23: Footer component

**Files:**
- Create: `src/components/layout/footer.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/container";

const FOOTER_LINKS = [
  { heading: "Catalog", links: [
    { href: "/catalog", label: "All Categories" },
    { href: "/gallery", label: "Inspiration Gallery" },
  ]},
  { heading: "Company", links: [
    { href: "/contact", label: "Contact" },
    { href: "/quote", label: "Request a Quote" },
  ]},
  { heading: "Legal", links: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ]},
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--color-state-line)] py-16">
      <Container className="grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-[var(--font-display)] text-2xl">{brand.name}</p>
          <p className="mt-3 text-sm text-[var(--color-ink-muted)] max-w-xs">{brand.tagline}</p>
          <p className="mt-6 text-xs uppercase tracking-wide text-[var(--color-brand-gold)]">
            {brand.serviceArea}
          </p>
        </div>
        {FOOTER_LINKS.map((col) => (
          <div key={col.heading}>
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-4">{col.heading}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-[var(--color-brand-gold)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="mt-12 pt-8 border-t border-[var(--color-state-line)] flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
        <span>© {new Date().getFullYear()} {brand.name}</span>
        <a href={`mailto:${brand.email}`} className="hover:text-[var(--color-brand-gold)]">{brand.email}</a>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/layout/footer.tsx
git commit -m "feat(layout): footer with sitemap, brand line, service area"
```

---

### Task 24: Root layout wires header + footer

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update layout**

Replace `RootLayout` in `src/app/layout.tsx`:

```tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// ...existing imports + metadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

`http://localhost:3000` shows header + default page + footer. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(layout): wire header and footer into root layout"
```

---

### Task 25: Legal stub routes

**Files:**
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`

These render from Sanity `legalPage` documents. If missing, fall back to placeholder copy.

- [ ] **Step 1: Privacy page**

`src/app/privacy/page.tsx`:

```tsx
import { Container } from "@/components/ui/container";
import { getLegalPage } from "@/lib/sanity/queries";

export const revalidate = 300;

export default async function PrivacyPage() {
  const doc = await getLegalPage("privacy");
  return (
    <Container narrow className="py-24">
      <h1 className="font-[var(--font-display)] text-5xl mb-8">{doc?.title ?? "Privacy Policy"}</h1>
      <article className="prose prose-invert">
        {doc?.body ? (
          <p>Rendered via PortableText in a later task once seed content exists.</p>
        ) : (
          <p className="text-[var(--color-ink-muted)]">
            Placeholder privacy policy. Real copy lands before promotion to live.
          </p>
        )}
      </article>
    </Container>
  );
}
```

- [ ] **Step 2: Terms page**

`src/app/terms/page.tsx` — same shape, swap `"privacy"` for `"terms"` and title fallback to `"Terms of Service"`.

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && npm run dev
```

Visit `/privacy` and `/terms` — render with fallback copy. Ctrl+C.

```bash
git add src/app/privacy src/app/terms
git commit -m "feat(legal): /privacy and /terms stub pages backed by sanity"
```

---

## Phase E — Home Page

### Task 26: Hero component

**Files:**
- Create: `src/components/home/hero.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

interface HeroProps {
  imageSrc: string;
  imageAlt: string;
}

export function Hero({ imageSrc, imageAlt }: HeroProps) {
  const reduced = useReducedMotion();
  return (
    <section className="relative h-[88vh] min-h-[640px] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={reduced ? { scale: 1 } : { scale: 1.05 }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-canvas)]/60 via-transparent to-[var(--color-bg-canvas)]" />
      </motion.div>

      <Container className="relative h-full flex flex-col justify-end pb-24">
        <Eyebrow>{brand.serviceArea}</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-[var(--font-display)] text-5xl md:text-7xl leading-[1.05] tracking-[var(--tracking-display)]">
          {brand.tagline}
        </h1>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/quote">{brand.ctaPrimary}</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/catalog">{brand.ctaSecondary}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/home/hero.tsx
git commit -m "feat(home): cinematic hero with ken burns drift"
```

---

### Task 27: CategoryGrid + featured sections

**Files:**
- Create: `src/components/home/category-grid.tsx`
- Create: `src/components/catalog/category-card.tsx` (used by both)

- [ ] **Step 1: CategoryCard**

`src/components/catalog/category-card.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

interface Category {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  heroImage?: unknown;
}

export function CategoryCard({ category }: { category: Category }) {
  const src = urlFor(category.heroImage)?.width(800).height(1000).url();
  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group block relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-elevated)]"
    >
      {src && (
        <Image
          src={src}
          alt={category.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-canvas)] via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-[var(--font-display)] text-2xl">{category.title}</h3>
        {category.tagline && (
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{category.tagline}</p>
        )}
        <div className="mt-3 h-px w-8 bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-16" />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: CategoryGrid**

`src/components/home/category-grid.tsx`:

```tsx
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CategoryCard } from "@/components/catalog/category-card";
import { Reveal } from "@/components/motion/reveal";

interface Category {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  heroImage?: unknown;
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Catalog</Eyebrow>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl">
            Furnishings for every banquet, ballroom, and venue.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat._id} delay={(i % 4) * 0.08}>
              <CategoryCard category={cat} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/home/category-grid.tsx src/components/catalog/category-card.tsx
git commit -m "feat(home): category grid + category card"
```

---

### Task 28: FeaturedProducts + ProductCard

**Files:**
- Create: `src/components/catalog/product-card.tsx`
- Create: `src/components/home/featured-products.tsx`

- [ ] **Step 1: ProductCard**

`src/components/catalog/product-card.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  images?: unknown[];
  category: { title: string; slug: string };
}

export function ProductCard({ product }: { product: Product }) {
  const first = product.images?.[0];
  const src = urlFor(first)?.width(700).height(700).url();
  return (
    <Link
      href={`/catalog/${product.category.slug}/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-elevated)]">
        {src && (
          <Image
            src={src}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
          {product.category.title}
        </p>
        <h3 className="mt-1 text-lg group-hover:text-[var(--color-brand-gold)] transition-colors">
          {product.title}
        </h3>
        <div className="mt-2 h-px w-6 bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-12" />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: FeaturedProducts**

`src/components/home/featured-products.tsx`:

```tsx
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProductCard } from "@/components/catalog/product-card";
import { Reveal } from "@/components/motion/reveal";

interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  images?: unknown[];
  category: { title: string; slug: string };
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="py-24 border-t border-[var(--color-state-line)]">
      <Container>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <Eyebrow>Featured</Eyebrow>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl">
              Pieces our buyers come back for.
            </h2>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p._id} delay={(i % 4) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/catalog/product-card.tsx src/components/home/featured-products.tsx
git commit -m "feat(home): featured products carousel + product card"
```

---

### Task 29: ProcessStrip (the trust section)

**Files:**
- Create: `src/components/home/process-strip.tsx`

- [ ] **Step 1: Implement**

```tsx
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    label: "We source",
    body: "Direct relationships with a curated bench of Chinese manufacturers — no middle layer, no markup parade.",
  },
  {
    label: "We verify",
    body: "Every order ships through our QC routine. Materials, finish, dimensions, packaging — checked before container loading.",
  },
  {
    label: "We deliver",
    body: "Containerized freight to a Canadian warehouse, then last-mile to your venue. Built for volumes, sized to the room.",
  },
];

export function ProcessStrip() {
  return (
    <section id="process" className="py-32 border-t border-[var(--color-state-line)]">
      <Container>
        <div className="max-w-2xl mb-16">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl">
            Importing, refined.
          </h2>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="border-t border-[var(--color-brand-gold)] pt-6">
                <p className="text-xs uppercase tracking-wide text-[var(--color-brand-gold)] mb-3">
                  0{i + 1} · {s.label}
                </p>
                <p className="text-base text-[var(--color-ink-primary)]/90 leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/home/process-strip.tsx
git commit -m "feat(home): process strip — source, verify, deliver"
```

---

### Task 30: GalleryTeaser

**Files:**
- Create: `src/components/home/gallery-teaser.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { urlFor } from "@/lib/sanity/image";

interface GalleryItem {
  _id: string;
  title?: string;
  image: unknown;
}

export function GalleryTeaser({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="py-24 border-t border-[var(--color-state-line)]">
      <Container>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <Eyebrow>Inspiration</Eyebrow>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl max-w-xl">
              Rooms our pieces have transformed.
            </h2>
          </div>
          <Link href="/gallery" className="hidden md:inline text-sm uppercase tracking-wide text-[var(--color-brand-gold)]">
            See all →
          </Link>
        </div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {items.slice(0, 6).map((g) => {
            const src = urlFor(g.image)?.width(600).height(800).url();
            return src ? (
              <Link key={g._id} href="/gallery" className="relative block aspect-[3/4] overflow-hidden">
                <Image src={src} alt={g.title ?? ""} fill sizes="20vw" className="object-cover" />
              </Link>
            ) : null;
          })}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/home/gallery-teaser.tsx
git commit -m "feat(home): gallery teaser strip"
```

---

### Task 31: CtaBand

**Files:**
- Create: `src/components/home/cta-band.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export function CtaBand() {
  return (
    <section className="py-32 border-t border-[var(--color-state-line)] bg-[var(--color-bg-elevated)]">
      <Container narrow className="text-center">
        <h2 className="font-[var(--font-display)] text-4xl md:text-6xl leading-tight">
          Get a quote in 24 hours.
        </h2>
        <p className="mt-6 text-[var(--color-ink-muted)] max-w-xl mx-auto">
          Tell us about the event. We'll come back with a tailored line sheet, sourcing options,
          and a delivery timeline you can plan against.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/quote">{brand.ctaPrimary}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/home/cta-band.tsx
git commit -m "feat(home): final CTA band"
```

---

### Task 32: Compose the Home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace src/app/page.tsx**

```tsx
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ProcessStrip } from "@/components/home/process-strip";
import { GalleryTeaser } from "@/components/home/gallery-teaser";
import { CtaBand } from "@/components/home/cta-band";
import { getCategories, getFeaturedProducts, getGalleryItems } from "@/lib/sanity/queries";

export const revalidate = 60;

// Hero fallback (used until siteSettings.heroImage is wired)
const FALLBACK_HERO = {
  src: "/og-default.jpg",
  alt: "Luxury banquet hall set for a formal dinner",
};

export default async function HomePage() {
  const [categories, featured, gallery] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getGalleryItems(),
  ]);

  return (
    <>
      <Hero imageSrc={FALLBACK_HERO.src} imageAlt={FALLBACK_HERO.alt} />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featured} />
      <ProcessStrip />
      <GalleryTeaser items={gallery} />
      <CtaBand />
    </>
  );
}
```

- [ ] **Step 2: Add a placeholder hero image**

Drop any 1920×1080 luxury banquet JPG into `public/og-default.jpg` for now. The seed task in Phase K replaces it with a Pexels-curated image referenced from Sanity `siteSettings`.

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Visit `/`. With empty Sanity, you'll see the hero + empty sections (which return null). That's expected — content comes in Phase K. Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx public/og-default.jpg
git commit -m "feat(home): compose hero, categories, featured, process, gallery, cta"
```

---

## Phase F — Catalog

### Task 33: FilterChips component

**Files:**
- Create: `src/components/catalog/filter-chips.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import * as React from "react";
import { Chip } from "@/components/ui/chip";

interface FilterChipsProps {
  tags: string[];
  value: string | null;
  onChange: (tag: string | null) => void;
}

export function FilterChips({ tags, value, onChange }: FilterChipsProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <Chip selected={value === null} onClick={() => onChange(null)}>All</Chip>
      {tags.map((tag) => (
        <Chip key={tag} selected={value === tag} onClick={() => onChange(tag)}>
          {tag}
        </Chip>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/catalog/filter-chips.tsx
git commit -m "feat(catalog): filter chips for tag-based filtering"
```

---

### Task 34: Catalog index page

**Files:**
- Create: `src/app/catalog/page.tsx`

Renders the 10 categories as a full grid (mirrors the Home grid, with a hero band).

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CategoryCard } from "@/components/catalog/category-card";
import { Reveal } from "@/components/motion/reveal";
import { getCategories } from "@/lib/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse every category of banquet furnishings we import — chiavari chairs, banquet tables, linens, dishware, lighting, and more.",
};

export default async function CatalogPage() {
  const categories = await getCategories();
  return (
    <>
      <section className="pt-24 pb-12">
        <Container narrow>
          <Eyebrow>Catalog</Eyebrow>
          <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-6xl">
            Every category. Every event.
          </h1>
          <p className="mt-6 text-[var(--color-ink-muted)] text-lg">
            Each category is quote-priced and import-direct. Containerized volumes welcome.
          </p>
        </Container>
      </section>
      <section className="py-12 pb-32">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat._id} delay={(i % 3) * 0.06}>
                <CategoryCard category={cat} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/app/catalog/page.tsx
git commit -m "feat(catalog): /catalog index page"
```

---

### Task 35: Category page with tag filter (client island)

**Files:**
- Create: `src/app/catalog/[category]/page.tsx`
- Create: `src/components/catalog/category-products.tsx`

The page is a server component (fetches data, SEO); the filterable product grid is a client island.

- [ ] **Step 1: Client island**

`src/components/catalog/category-products.tsx`:

```tsx
"use client";

import * as React from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { FilterChips } from "@/components/catalog/filter-chips";
import { Reveal } from "@/components/motion/reveal";

interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  images?: unknown[];
  tags?: string[];
}

interface Props {
  categorySlug: string;
  categoryTitle: string;
  products: Product[];
}

export function CategoryProducts({ categorySlug, categoryTitle, products }: Props) {
  const allTags = React.useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.tags ?? []))).sort(),
    [products],
  );
  const [active, setActive] = React.useState<string | null>(null);
  const visible = active === null ? products : products.filter((p) => p.tags?.includes(active));

  return (
    <>
      {allTags.length > 0 && (
        <div className="mb-10">
          <FilterChips tags={allTags} value={active} onChange={setActive} />
        </div>
      )}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={p._id} delay={(i % 3) * 0.06}>
            <ProductCard product={{ ...p, category: { slug: categorySlug, title: categoryTitle } }} />
          </Reveal>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="text-[var(--color-ink-muted)]">No items match this filter.</p>
      )}
    </>
  );
}
```

- [ ] **Step 2: Server page**

`src/app/catalog/[category]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CategoryProducts } from "@/components/catalog/category-products";
import { getCategory } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return {};
  return {
    title: cat.seo?.metaTitle ?? cat.title,
    description: cat.seo?.metaDescription ?? cat.tagline,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();

  const heroSrc = urlFor(cat.heroImage)?.width(1600).height(900).url();

  return (
    <>
      {heroSrc && (
        <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
          <Image src={heroSrc} alt={cat.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-canvas)]/40 to-[var(--color-bg-canvas)]" />
        </section>
      )}
      <section className="py-16">
        <Container narrow>
          <nav className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-4">
            <Link href="/catalog" className="hover:text-[var(--color-brand-gold)]">Catalog</Link>
            <span> · </span>
            <span>{cat.title}</span>
          </nav>
          <Eyebrow>Category</Eyebrow>
          <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-6xl">{cat.title}</h1>
          {cat.tagline && (
            <p className="mt-4 text-lg text-[var(--color-ink-muted)]">{cat.tagline}</p>
          )}
        </Container>
      </section>
      <section className="pb-32">
        <Container>
          <CategoryProducts
            categorySlug={cat.slug}
            categoryTitle={cat.title}
            products={cat.products ?? []}
          />
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/app/catalog src/components/catalog/category-products.tsx
git commit -m "feat(catalog): category page with tag filter island"
```

---

### Task 36: ProductGallery (image lightbox-zoom column)

**Files:**
- Create: `src/components/catalog/product-gallery.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: unknown[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = React.useState(0);
  const main = images[active];
  const mainSrc = urlFor(main)?.width(1200).height(1200).url();
  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-square bg-[var(--color-bg-elevated)] overflow-hidden">
        {mainSrc && (
          <Image src={mainSrc} alt={alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {images.map((img, i) => {
            const src = urlFor(img)?.width(200).height(200).url();
            if (!src) return null;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative aspect-square overflow-hidden border-2",
                  i === active
                    ? "border-[var(--color-brand-gold)]"
                    : "border-transparent hover:border-[var(--color-state-line)]",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/catalog/product-gallery.tsx
git commit -m "feat(catalog): product gallery with thumbnail picker"
```

---

### Task 37: SpecSheet

**Files:**
- Create: `src/components/catalog/spec-sheet.tsx`

- [ ] **Step 1: Implement**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

interface Spec {
  label: string;
  value: string;
}

interface SpecSheetProps {
  category: string;
  title: string;
  shortDescription?: string;
  specs?: Spec[];
  productSlug: string;
}

export function SpecSheet({ category, title, shortDescription, specs = [], productSlug }: SpecSheetProps) {
  return (
    <div>
      <Eyebrow>{category}</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl leading-tight">{title}</h1>
      {shortDescription && (
        <p className="mt-6 text-lg text-[var(--color-ink-muted)] leading-relaxed">{shortDescription}</p>
      )}
      {specs.length > 0 && (
        <dl className="mt-10 border-t border-[var(--color-state-line)]">
          {specs.map((s) => (
            <div
              key={s.label}
              className="flex justify-between py-4 border-b border-[var(--color-state-line)]"
            >
              <dt className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">{s.label}</dt>
              <dd className="text-sm text-[var(--color-ink-primary)]">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-10">
        <Button asChild size="lg">
          <Link href={`/quote?product=${encodeURIComponent(productSlug)}`}>Request a Quote</Link>
        </Button>
      </div>
      <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
        We reply within 24 hours with sourcing options and pricing for your volume.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
npm run typecheck && npm run lint
git add src/components/catalog/spec-sheet.tsx
git commit -m "feat(catalog): spec sheet with quote CTA"
```

---

### Task 38: Product detail page

**Files:**
- Create: `src/app/catalog/[category]/[product]/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { SpecSheet } from "@/components/catalog/spec-sheet";
import { getProduct, getCategory } from "@/lib/sanity/queries";
import { ProductCard } from "@/components/catalog/product-card";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ category: string; product: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, product } = await params;
  const p = await getProduct(category, product);
  if (!p) return {};
  return {
    title: p.seo?.metaTitle ?? p.title,
    description: p.seo?.metaDescription ?? p.shortDescription,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { category, product } = await params;
  const p = await getProduct(category, product);
  if (!p) notFound();

  // For "related products" — fetch the category and pick siblings excluding self.
  const cat = await getCategory(category);
  const related = (cat?.products ?? []).filter((rp) => rp.slug !== p.slug).slice(0, 4);

  return (
    <>
      <Container className="pt-12 pb-24">
        <nav className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-8">
          <Link href="/catalog" className="hover:text-[var(--color-brand-gold)]">Catalog</Link>
          <span> · </span>
          <Link href={`/catalog/${p.category.slug}`} className="hover:text-[var(--color-brand-gold)]">
            {p.category.title}
          </Link>
          <span> · </span>
          <span>{p.title}</span>
        </nav>
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery images={p.images ?? []} alt={p.title} />
          <SpecSheet
            category={p.category.title}
            title={p.title}
            shortDescription={p.shortDescription}
            specs={p.specs}
            productSlug={p.slug}
          />
        </div>
      </Container>
      {related.length > 0 && (
        <section className="py-24 border-t border-[var(--color-state-line)]">
          <Container>
            <h2 className="font-[var(--font-display)] text-3xl mb-10">More from {p.category.title}</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard
                  key={r._id}
                  product={{ ...r, category: { slug: p.category.slug, title: p.category.title } }}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/app/catalog/[category]/[product]/page.tsx
git commit -m "feat(catalog): product detail page with gallery, spec sheet, related"
```

---

## Phase G — Gallery

### Task 39: Lightbox + MasonryGrid

**Files:**
- Create: `src/components/gallery/lightbox.tsx`
- Create: `src/components/gallery/masonry-grid.tsx`

- [ ] **Step 1: Lightbox**

`src/components/gallery/lightbox.tsx`:

```tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";

interface LightboxItem {
  _id: string;
  title?: string;
  image: unknown;
}

interface LightboxProps {
  item: LightboxItem | null;
  onClose: () => void;
}

export function Lightbox({ item, onClose }: LightboxProps) {
  React.useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;
  const src = urlFor(item.image)?.width(1600).url();
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-[var(--color-bg-canvas)]/95 backdrop-blur flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-6 right-6 text-[var(--color-ink-primary)] text-3xl"
      >×</button>
      {src && (
        <div className="relative w-full max-w-5xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
          <Image src={src} alt={item.title ?? ""} fill sizes="80vw" className="object-contain" />
          <div className="mt-6 flex items-center justify-between">
            {item.title && <p className="text-sm text-[var(--color-ink-muted)]">{item.title}</p>}
            <Link
              href={`/quote?notes=${encodeURIComponent(`Inspired by gallery: ${item.title ?? "(untitled)"}`)}`}
              className="text-xs uppercase tracking-wide text-[var(--color-brand-gold)]"
              onClick={onClose}
            >
              Request similar setup →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: MasonryGrid**

`src/components/gallery/masonry-grid.tsx`:

```tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { FilterChips } from "@/components/catalog/filter-chips";
import { Lightbox } from "@/components/gallery/lightbox";

interface GalleryItem {
  _id: string;
  title?: string;
  image: unknown;
  tags?: string[];
}

export function MasonryGrid({ items }: { items: GalleryItem[] }) {
  const allTags = React.useMemo(
    () => Array.from(new Set(items.flatMap((g) => g.tags ?? []))).sort(),
    [items],
  );
  const [active, setActive] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<GalleryItem | null>(null);
  const visible = active === null ? items : items.filter((g) => g.tags?.includes(active));

  return (
    <>
      {allTags.length > 0 && (
        <div className="mb-10">
          <FilterChips tags={allTags} value={active} onChange={setActive} />
        </div>
      )}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
        {visible.map((g) => {
          const src = urlFor(g.image)?.width(800).url();
          if (!src) return null;
          return (
            <button
              key={g._id}
              onClick={() => setOpen(g)}
              className="block mb-4 w-full overflow-hidden bg-[var(--color-bg-elevated)] break-inside-avoid"
            >
              <div className="relative w-full">
                <Image
                  src={src}
                  alt={g.title ?? ""}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="w-full h-auto object-cover transition-opacity hover:opacity-90"
                />
              </div>
            </button>
          );
        })}
      </div>
      <Lightbox item={open} onClose={() => setOpen(null)} />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
npm run typecheck && npm run lint
git add src/components/gallery
git commit -m "feat(gallery): lightbox + masonry grid with tag filter"
```

---

### Task 40: /gallery page

**Files:**
- Create: `src/app/gallery/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MasonryGrid } from "@/components/gallery/masonry-grid";
import { getGalleryItems } from "@/lib/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Inspiration Gallery",
  description: "Luxury banquet and wedding setups our pieces have shaped — across ballrooms, gardens, and corporate venues.",
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return (
    <>
      <section className="pt-24 pb-12">
        <Container narrow>
          <Eyebrow>Inspiration</Eyebrow>
          <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-6xl">
            Rooms we've helped shape.
          </h1>
          <p className="mt-6 text-[var(--color-ink-muted)] text-lg">
            Tap any image for a closer look — or to start a quote inspired by what you see.
          </p>
        </Container>
      </section>
      <section className="pb-32">
        <Container>
          <MasonryGrid items={items} />
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
npm run typecheck && npm run lint
git add src/app/gallery
git commit -m "feat(gallery): /gallery page with masonry + tag filter"
```

---

## Phase H — Lead Pipeline

### Task 41: Zod schemas for leads (TDD)

**Files:**
- Test: `tests/unit/leads-schema.test.ts`
- Create: `src/lib/leads/schema.ts`

- [ ] **Step 1: Install zod**

```bash
npm install zod
```

- [ ] **Step 2: Failing test**

`tests/unit/leads-schema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { QuotePayloadSchema, ContactPayloadSchema, LeadSchema } from "@/lib/leads/schema";

const validQuote = {
  source: "quote" as const,
  name: "Jane Doe",
  company: "Northwood Banquet Hall",
  email: "jane@northwood.com",
  phone: "416-555-0100",
  eventType: "wedding",
  eventDate: "2026-09-12",
  headcount: 220,
  city: "Toronto",
  province: "ON",
  categories: ["chiavari-chairs", "linens"],
  products: [],
  budget: "15-50k",
  needBy: "2026-08-01",
  notes: "Outdoor reception. Need 220 gold chiavari + matching linens.",
  consent: true,
  honeypot: "",
  turnstileToken: "x-mock-token",
};

describe("QuotePayloadSchema", () => {
  it("accepts a complete valid payload", () => {
    const r = QuotePayloadSchema.safeParse(validQuote);
    expect(r.success).toBe(true);
  });
  it("requires consent === true", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, consent: false });
    expect(r.success).toBe(false);
  });
  it("rejects bad email", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, email: "not-an-email" });
    expect(r.success).toBe(false);
  });
  it("rejects non-empty honeypot", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, honeypot: "spam" });
    expect(r.success).toBe(false);
  });
  it("accepts headcount as positive integer", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, headcount: 0 });
    expect(r.success).toBe(false);
  });
});

describe("ContactPayloadSchema", () => {
  it("accepts a minimal contact form payload", () => {
    const r = ContactPayloadSchema.safeParse({
      source: "contact",
      name: "Joe",
      email: "joe@example.com",
      message: "Hi, looking to talk.",
      consent: true,
      honeypot: "",
      turnstileToken: "tok",
    });
    expect(r.success).toBe(true);
  });
  it("rejects missing message", () => {
    const r = ContactPayloadSchema.safeParse({
      source: "contact",
      name: "Joe",
      email: "joe@example.com",
      consent: true,
      honeypot: "",
      turnstileToken: "tok",
    });
    expect(r.success).toBe(false);
  });
});

describe("LeadSchema (discriminated union)", () => {
  it("parses a quote", () => {
    const r = LeadSchema.safeParse(validQuote);
    expect(r.success).toBe(true);
  });
  it("parses a contact", () => {
    const r = LeadSchema.safeParse({
      source: "contact",
      name: "Joe",
      email: "joe@example.com",
      message: "Hi",
      consent: true,
      honeypot: "",
      turnstileToken: "tok",
    });
    expect(r.success).toBe(true);
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npm test -- leads-schema
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement schema.ts**

`src/lib/leads/schema.ts`:

```ts
import { z } from "zod";

const baseFields = {
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  consent: z.literal(true),
  honeypot: z.literal(""),
  turnstileToken: z.string().min(1).max(2000),
};

export const QuotePayloadSchema = z.object({
  source: z.literal("quote"),
  ...baseFields,
  company: z.string().min(1).max(200),
  phone: z.string().min(7).max(40),
  eventType: z.enum(["wedding", "corporate", "gala", "other"]),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("TBD")),
  headcount: z.number().int().min(1).max(100_000),
  city: z.string().min(1).max(120),
  province: z.string().min(2).max(40),
  categories: z.array(z.string().min(1)).max(20).default([]),
  products: z.array(z.string().min(1)).max(20).default([]),
  budget: z.enum(["<5k", "5-15k", "15-50k", "50k+", "not-sure"]),
  needBy: z.string().min(1).max(40),
  notes: z.string().max(2000).optional().default(""),
});

export const ContactPayloadSchema = z.object({
  source: z.literal("contact"),
  ...baseFields,
  message: z.string().min(1).max(4000),
});

export const LeadSchema = z.discriminatedUnion("source", [
  QuotePayloadSchema,
  ContactPayloadSchema,
]);

export type QuotePayload = z.infer<typeof QuotePayloadSchema>;
export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
export type LeadPayload = z.infer<typeof LeadSchema>;
```

- [ ] **Step 5: Run, verify pass**

```bash
npm test -- leads-schema
```

Expected: all leads-schema tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/leads/schema.ts tests/unit/leads-schema.test.ts package.json package-lock.json
git commit -m "feat(leads): zod schemas for quote/contact/lead union"
```

---

### Task 42: Turnstile verifier (TDD with mocked fetch)

**Files:**
- Test: `tests/unit/leads-turnstile.test.ts`
- Create: `src/lib/leads/turnstile.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-x");
  vi.restoreAllMocks();
});

import { verifyTurnstile } from "@/lib/leads/turnstile";

describe("verifyTurnstile", () => {
  it("returns true when Cloudflare reports success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    } as Response) as typeof fetch;
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(true);
  });

  it("returns false when Cloudflare reports failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: false, "error-codes": ["invalid"] }),
    } as Response) as typeof fetch;
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(false);
  });

  it("returns false when secret key is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(false);
  });

  it("returns false on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("net")) as typeof fetch;
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(false);
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm test -- turnstile
```

- [ ] **Step 3: Implement**

`src/lib/leads/turnstile.ts`:

```ts
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run, verify pass + commit**

```bash
npm test -- turnstile
git add src/lib/leads/turnstile.ts tests/unit/leads-turnstile.test.ts
git commit -m "feat(leads): cloudflare turnstile server-side verifier"
```

---

### Task 43: Rate limiter (TDD)

**Files:**
- Test: `tests/unit/rate-limit.test.ts`
- Create: `src/lib/rate-limit.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => vi.useFakeTimers());

  it("allows up to N hits per window", () => {
    const rl = createRateLimiter({ max: 3, windowMs: 60_000 });
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(false);
  });

  it("isolates buckets by key", () => {
    const rl = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(false);
    expect(rl.check("b")).toBe(true);
  });

  it("resets after the window expires", () => {
    const rl = createRateLimiter({ max: 1, windowMs: 1000 });
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rl.check("a")).toBe(true);
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm test -- rate-limit
```

- [ ] **Step 3: Implement**

`src/lib/rate-limit.ts`:

```ts
interface LimiterOpts {
  max: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createRateLimiter({ max, windowMs }: LimiterOpts) {
  const buckets = new Map<string, Bucket>();
  return {
    check(key: string): boolean {
      const now = Date.now();
      const b = buckets.get(key);
      if (!b || now >= b.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (b.count >= max) return false;
      b.count += 1;
      return true;
    },
  };
}

export const leadRateLimiter = createRateLimiter({ max: 3, windowMs: 60 * 60 * 1000 });
```

- [ ] **Step 4: Run, verify pass + commit**

```bash
npm test -- rate-limit
git add src/lib/rate-limit.ts tests/unit/rate-limit.test.ts
git commit -m "feat(leads): in-memory LRU-style rate limiter"
```

---

### Task 44: Sheets adapter (TDD with mocked googleapis)

**Files:**
- Test: `tests/unit/leads-sheets.test.ts`
- Create: `src/lib/leads/sheets.ts`

- [ ] **Step 1: Install googleapis**

```bash
npm install googleapis
```

- [ ] **Step 2: Failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const appendMock = vi.fn();

vi.mock("googleapis", () => ({
  google: {
    auth: { GoogleAuth: class { constructor() {} async getClient() { return {}; } } },
    sheets: () => ({ spreadsheets: { values: { append: appendMock } } }),
  },
}));

beforeEach(() => {
  appendMock.mockReset();
  vi.unstubAllEnvs();
  vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_JSON", Buffer.from(JSON.stringify({
    client_email: "x@x.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nk\n-----END PRIVATE KEY-----\n",
  })).toString("base64"));
  vi.stubEnv("GOOGLE_SHEET_ID", "sheet-id");
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
      eventType: "wedding",
      eventDate: "2026-09-12",
      headcount: 200,
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
    const call = appendMock.mock.calls[0][0];
    expect(call.spreadsheetId).toBe("sheet-id");
    expect(call.valueInputOption).toBe("RAW");
    expect(call.requestBody.values[0]).toEqual([
      "2026-05-19T20:00:00Z", "quote", "Jane", "X", "jane@x.com", "555",
      "wedding", "2026-09-12", 200, "Toronto", "ON",
      "chiavari-chairs,linens", "", "15-50k", "2026-08-01", "n",
      "", "", "", "CA",
    ]);
  });

  it("throws if service account env is missing", async () => {
    vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_JSON", "");
    await expect(appendLeadRow({
      timestamp: "t", source: "contact", name: "n", company: "", email: "e@e.com",
      phone: "", eventType: "", eventDate: "", headcount: 0, city: "", province: "",
      categories: "", products: "", budget: "", needBy: "", notes: "",
      utmSource: "", utmMedium: "", utmCampaign: "", ipCountry: "",
    })).rejects.toThrow(/GOOGLE_SERVICE_ACCOUNT_JSON/);
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npm test -- leads-sheets
```

- [ ] **Step 4: Implement**

`src/lib/leads/sheets.ts`:

```ts
import { google } from "googleapis";

export interface SheetRow {
  timestamp: string;
  source: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  headcount: number;
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
    range: "A:T",
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        row.timestamp, row.source, row.name, row.company, row.email, row.phone,
        row.eventType, row.eventDate, row.headcount, row.city, row.province,
        row.categories, row.products, row.budget, row.needBy, row.notes,
        row.utmSource, row.utmMedium, row.utmCampaign, row.ipCountry,
      ]],
    },
  });
}
```

- [ ] **Step 5: Run, verify pass + commit**

```bash
npm test -- leads-sheets
git add src/lib/leads/sheets.ts tests/unit/leads-sheets.test.ts package.json package-lock.json
git commit -m "feat(leads): google sheets adapter with service account auth"
```

---

### Task 45: Resend email adapter (TDD)

**Files:**
- Test: `tests/unit/leads-emails.test.ts`
- Create: `src/lib/leads/emails.ts`

- [ ] **Step 1: Install resend**

```bash
npm install resend
```

- [ ] **Step 2: Failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class { emails = { send: sendMock }; },
}));

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "msg-1" }, error: null });
  vi.unstubAllEnvs();
  vi.stubEnv("RESEND_API_KEY", "re_xxx");
  vi.stubEnv("LEAD_NOTIFY_EMAIL", "owner@example.com");
  vi.stubEnv("LEAD_FROM_EMAIL", "Maison Banquet <noreply@maison.test>");
});

import { sendInternalNotification, sendLeadAutoReply } from "@/lib/leads/emails";

describe("sendInternalNotification", () => {
  it("sends to LEAD_NOTIFY_EMAIL with a subject containing the source", async () => {
    await sendInternalNotification({
      source: "quote",
      summary: { name: "Jane", email: "j@e.com" },
      html: "<p>raw lead</p>",
    });
    expect(sendMock).toHaveBeenCalledOnce();
    const args = sendMock.mock.calls[0][0];
    expect(args.to).toBe("owner@example.com");
    expect(args.subject).toMatch(/quote/i);
    expect(args.html).toContain("raw lead");
  });
});

describe("sendLeadAutoReply", () => {
  it("uses quote template for source=quote", async () => {
    await sendLeadAutoReply({ source: "quote", to: "jane@example.com", name: "Jane" });
    const args = sendMock.mock.calls[0][0];
    expect(args.to).toBe("jane@example.com");
    expect(args.subject).toMatch(/quote/i);
    expect(args.html).toMatch(/24 hours/i);
  });
  it("uses contact template for source=contact", async () => {
    await sendLeadAutoReply({ source: "contact", to: "j@e.com", name: "Joe" });
    const args = sendMock.mock.calls[0][0];
    expect(args.subject).toMatch(/received/i);
  });
  it("no-ops if RESEND_API_KEY is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await sendLeadAutoReply({ source: "contact", to: "j@e.com", name: "Joe" });
    expect(sendMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npm test -- leads-emails
```

- [ ] **Step 4: Implement**

`src/lib/leads/emails.ts`:

```ts
import { Resend } from "resend";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function from(): string {
  return process.env.LEAD_FROM_EMAIL ?? "Maison Banquet <noreply@maisonbanquet.example>";
}

export async function sendInternalNotification(input: {
  source: "quote" | "contact";
  summary: Record<string, unknown>;
  html: string;
}): Promise<void> {
  const client = getClient();
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!client || !to) return;
  await client.emails.send({
    from: from(),
    to,
    subject: `[Maison Banquet] new ${input.source} lead — ${String(input.summary.name ?? "(no name)")}`,
    html: input.html,
  });
}

export async function sendLeadAutoReply(input: {
  source: "quote" | "contact";
  to: string;
  name: string;
}): Promise<void> {
  const client = getClient();
  if (!client) return;

  const isQuote = input.source === "quote";
  const subject = isQuote
    ? "We've received your quote request — Maison Banquet Co."
    : "We've received your message — Maison Banquet Co.";
  const body = isQuote
    ? `<p>Hi ${escape(input.name)},</p>
       <p>Thanks for reaching out — we've received your quote request. A member of our team will review the details and reply within <strong>24 hours</strong> with sourcing options, pricing, and a delivery timeline.</p>
       <p>— Maison Banquet Co.</p>`
    : `<p>Hi ${escape(input.name)},</p>
       <p>Thanks for the note — we've received your message and will reply shortly.</p>
       <p>— Maison Banquet Co.</p>`;

  await client.emails.send({ from: from(), to: input.to, subject, html: body });
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
```

- [ ] **Step 5: Run, verify pass + commit**

```bash
npm test -- leads-emails
git add src/lib/leads/emails.ts tests/unit/leads-emails.test.ts package.json package-lock.json
git commit -m "feat(leads): resend adapter for internal notify + auto-reply"
```

---

### Task 46: Agent webhook poster (TDD)

**Files:**
- Test: `tests/unit/leads-webhook.test.ts`
- Create: `src/lib/leads/webhook.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

import { postToAgentWebhook } from "@/lib/leads/webhook";

describe("postToAgentWebhook", () => {
  it("is a no-op when AGENT_WEBHOOK_URL is unset", async () => {
    vi.stubEnv("AGENT_WEBHOOK_URL", "");
    const fetchMock = vi.fn();
    global.fetch = fetchMock as typeof fetch;
    await postToAgentWebhook({ source: "quote", name: "x" } as unknown as Parameters<typeof postToAgentWebhook>[0]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POSTs JSON when AGENT_WEBHOOK_URL is set", async () => {
    vi.stubEnv("AGENT_WEBHOOK_URL", "https://agent.example/leads");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response);
    global.fetch = fetchMock as typeof fetch;
    await postToAgentWebhook({ source: "contact", name: "Joe" } as unknown as Parameters<typeof postToAgentWebhook>[0]);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example/leads");
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
  });

  it("does not throw on network failure", async () => {
    vi.stubEnv("AGENT_WEBHOOK_URL", "https://agent.example/leads");
    global.fetch = vi.fn().mockRejectedValue(new Error("net")) as typeof fetch;
    await expect(postToAgentWebhook({ source: "contact", name: "Joe" } as unknown as Parameters<typeof postToAgentWebhook>[0])).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm test -- leads-webhook
```

- [ ] **Step 3: Implement**

`src/lib/leads/webhook.ts`:

```ts
import type { LeadPayload } from "./schema";

export async function postToAgentWebhook(payload: LeadPayload): Promise<void> {
  const url = process.env.AGENT_WEBHOOK_URL;
  if (!url) return;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(t);
  } catch (err) {
    console.warn("[agent-webhook] post failed (non-fatal)", err);
  }
}
```

- [ ] **Step 4: Run, verify pass + commit**

```bash
npm test -- leads-webhook
git add src/lib/leads/webhook.ts tests/unit/leads-webhook.test.ts
git commit -m "feat(leads): optional agent webhook poster with timeout"
```

---

### Task 47: submit.ts orchestrator (TDD with all sinks mocked)

**Files:**
- Test: `tests/unit/leads-submit.test.ts`
- Create: `src/lib/leads/submit.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/leads/sheets", () => ({ appendLeadRow: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/leads/emails", () => ({
  sendInternalNotification: vi.fn().mockResolvedValue(undefined),
  sendLeadAutoReply: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/leads/webhook", () => ({ postToAgentWebhook: vi.fn().mockResolvedValue(undefined) }));

import { submitLead } from "@/lib/leads/submit";
import { appendLeadRow } from "@/lib/leads/sheets";
import { sendInternalNotification, sendLeadAutoReply } from "@/lib/leads/emails";
import { postToAgentWebhook } from "@/lib/leads/webhook";

const validQuote = {
  source: "quote" as const,
  name: "Jane",
  company: "Northwood",
  email: "jane@northwood.com",
  phone: "416-555-0100",
  eventType: "wedding" as const,
  eventDate: "2026-09-12",
  headcount: 220,
  city: "Toronto",
  province: "ON",
  categories: ["chiavari-chairs"],
  products: [],
  budget: "15-50k" as const,
  needBy: "2026-08-01",
  notes: "",
  consent: true as const,
  honeypot: "" as const,
  turnstileToken: "tok",
};

beforeEach(() => vi.clearAllMocks());

describe("submitLead", () => {
  it("fans out to all sinks for a quote payload", async () => {
    await submitLead(validQuote, { ipCountry: "CA" });
    expect(appendLeadRow).toHaveBeenCalledOnce();
    expect(sendInternalNotification).toHaveBeenCalledOnce();
    expect(sendLeadAutoReply).toHaveBeenCalledOnce();
    expect(postToAgentWebhook).toHaveBeenCalledOnce();
  });

  it("does not throw if one sink fails", async () => {
    (appendLeadRow as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("sheets down"));
    await expect(submitLead(validQuote, {})).resolves.toBeUndefined();
    expect(sendInternalNotification).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm test -- leads-submit
```

- [ ] **Step 3: Implement**

`src/lib/leads/submit.ts`:

```ts
import type { LeadPayload } from "./schema";
import { appendLeadRow, type SheetRow } from "./sheets";
import { sendInternalNotification, sendLeadAutoReply } from "./emails";
import { postToAgentWebhook } from "./webhook";

interface SubmitContext {
  ipCountry?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
}

export async function submitLead(payload: LeadPayload, ctx: SubmitContext): Promise<void> {
  const timestamp = new Date().toISOString();
  const row: SheetRow = toSheetRow(payload, timestamp, ctx);
  const summary = toSummary(payload);
  const html = toHtml(payload, timestamp);

  await Promise.allSettled([
    appendLeadRow(row),
    sendInternalNotification({ source: payload.source, summary, html }),
    sendLeadAutoReply({ source: payload.source, to: payload.email, name: payload.name }),
    postToAgentWebhook(payload),
  ]).then((results) => {
    for (const r of results) {
      if (r.status === "rejected") {
        console.warn("[lead-submit] sink failed (non-fatal)", r.reason);
      }
    }
  });
}

function toSheetRow(p: LeadPayload, timestamp: string, ctx: SubmitContext): SheetRow {
  const base = {
    timestamp,
    source: p.source,
    name: p.name,
    email: p.email,
    company: "",
    phone: "",
    eventType: "",
    eventDate: "",
    headcount: 0,
    city: "",
    province: "",
    categories: "",
    products: "",
    budget: "",
    needBy: "",
    notes: "",
    utmSource: ctx.utm?.source ?? "",
    utmMedium: ctx.utm?.medium ?? "",
    utmCampaign: ctx.utm?.campaign ?? "",
    ipCountry: ctx.ipCountry ?? "",
  };
  if (p.source === "quote") {
    return {
      ...base,
      company: p.company,
      phone: p.phone,
      eventType: p.eventType,
      eventDate: p.eventDate,
      headcount: p.headcount,
      city: p.city,
      province: p.province,
      categories: p.categories.join(","),
      products: p.products.join(","),
      budget: p.budget,
      needBy: p.needBy,
      notes: p.notes ?? "",
    };
  }
  return { ...base, notes: p.message };
}

function toSummary(p: LeadPayload): Record<string, unknown> {
  if (p.source === "quote") {
    return {
      name: p.name, company: p.company, email: p.email, phone: p.phone,
      eventType: p.eventType, eventDate: p.eventDate, headcount: p.headcount,
      city: p.city, province: p.province, budget: p.budget,
      categories: p.categories, products: p.products,
    };
  }
  return { name: p.name, email: p.email, message: p.message };
}

function toHtml(p: LeadPayload, timestamp: string): string {
  const entries = Object.entries(toSummary(p));
  const rows = entries
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${String(v)}</td></tr>`)
    .join("");
  return `<p>New ${p.source} lead at ${timestamp}.</p><table>${rows}</table>`;
}
```

- [ ] **Step 4: Run, verify pass + commit**

```bash
npm test -- leads-submit
git add src/lib/leads/submit.ts tests/unit/leads-submit.test.ts
git commit -m "feat(leads): submit orchestrator fans out to all sinks"
```

---

### Task 48: /api/lead HTTP route

**Files:**
- Create: `src/app/api/lead/route.ts`

The route is thin: parse → validate → spam checks → submit. No business logic here.

- [ ] **Step 1: Implement**

`src/app/api/lead/route.ts`:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LeadSchema } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";
import { verifyTurnstile } from "@/lib/leads/turnstile";
import { leadRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!leadRateLimiter.check(ip)) {
    return NextResponse.json({ error: "rate-limited" }, { status: 429 });
  }

  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!ok) {
    return NextResponse.json({ error: "turnstile-failed" }, { status: 400 });
  }

  await submitLead(parsed.data, {
    ipCountry: req.headers.get("x-vercel-ip-country") ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Smoke-test with curl**

(Optional during plan execution; the e2e suite in Phase K covers it programmatically.)

```bash
npm run dev
```

Different terminal:

```bash
curl -s -X POST http://localhost:3000/api/lead -H "Content-Type: application/json" -d "{}"
```

Expected: HTTP 400 with `{"error":"validation",...}`. Ctrl+C dev.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/lead/route.ts
git commit -m "feat(api): /api/lead route — validate, spam checks, submit"
```

---

### Task 49: Turnstile client widget

**Files:**
- Create: `src/components/quote/turnstile.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import * as React from "react";
import Script from "next/script";

interface TurnstileProps {
  onVerify: (token: string) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, opts: Record<string, unknown>) => string;
    };
  }
}

export function Turnstile({ onVerify }: TurnstileProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [ready, setReady] = React.useState(false);

  // Dev fallback: when no site key is configured, hand back a bypass token
  // immediately so local development can submit the form. The server still
  // enforces verification when TURNSTILE_SECRET_KEY is set.
  React.useEffect(() => {
    if (!siteKey) onVerify("dev-bypass-token");
  }, [siteKey, onVerify]);

  React.useEffect(() => {
    if (!ready || !ref.current || !siteKey || !window.turnstile) return;
    window.turnstile.render(ref.current, { sitekey: siteKey, callback: onVerify, theme: "dark" });
  }, [ready, siteKey, onVerify]);

  if (!siteKey) {
    return <p className="text-xs text-[var(--color-ink-muted)]">(Turnstile disabled in dev)</p>;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div ref={ref} />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
npm run typecheck && npm run lint
git add src/components/quote/turnstile.tsx
git commit -m "feat(quote): turnstile widget with dev bypass"
```

---

## Phase I — Forms

### Task 50: Step components for the quote form

**Files:**
- Create: `src/components/quote/step-event.tsx`
- Create: `src/components/quote/step-product.tsx`
- Create: `src/components/quote/step-contact.tsx`

These are dumb presentational pieces — they receive `value` + `onChange` and render the fields. State and orchestration live in `quote-form.tsx` (Task 51).

The categories list mirrors the spec's seed list of 10.

- [ ] **Step 1: Shared types**

Create `src/components/quote/types.ts`:

```ts
export interface QuoteFormState {
  // step 1
  eventType: "wedding" | "corporate" | "gala" | "other" | "";
  eventDate: string;
  headcount: number | "";
  city: string;
  province: string;
  // step 2
  categories: string[];
  products: string[];
  budget: "<5k" | "5-15k" | "15-50k" | "50k+" | "not-sure" | "";
  needBy: string;
  // step 3
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  consent: boolean;
  // hidden
  honeypot: string;
}

export const PROVINCES = ["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"] as const;
export const CATEGORIES = [
  { slug: "chiavari-chairs", label: "Chiavari Chairs" },
  { slug: "banquet-tables", label: "Banquet Tables" },
  { slug: "chair-covers-and-sashes", label: "Chair Covers & Sashes" },
  { slug: "linens", label: "Linens" },
  { slug: "charger-plates", label: "Charger Plates" },
  { slug: "centerpieces-and-florals", label: "Centerpieces & Florals" },
  { slug: "stage-and-backdrop", label: "Stage & Backdrop" },
  { slug: "dishes-and-glassware", label: "Dishes & Glassware" },
  { slug: "event-lighting", label: "Event Lighting" },
  { slug: "pipe-and-drape", label: "Pipe & Drape" },
] as const;
```

- [ ] **Step 2: step-event.tsx**

```tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { QuoteFormState } from "./types";
import { PROVINCES } from "./types";

interface Props {
  value: QuoteFormState;
  onChange: (patch: Partial<QuoteFormState>) => void;
}

export function StepEvent({ value, onChange }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Field label="Event type">
        <Select value={value.eventType} onChange={(e) => onChange({ eventType: e.target.value as QuoteFormState["eventType"] })}>
          <option value="">Select…</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate</option>
          <option value="gala">Gala</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field label="Event date (or TBD)">
        <Input
          type="text"
          placeholder="YYYY-MM-DD or TBD"
          value={value.eventDate}
          onChange={(e) => onChange({ eventDate: e.target.value })}
        />
      </Field>
      <Field label="Headcount">
        <Input
          type="number"
          min={1}
          value={value.headcount === "" ? "" : String(value.headcount)}
          onChange={(e) => onChange({ headcount: e.target.value === "" ? "" : Number(e.target.value) })}
        />
      </Field>
      <Field label="Delivery city">
        <Input value={value.city} onChange={(e) => onChange({ city: e.target.value })} />
      </Field>
      <Field label="Province">
        <Select value={value.province} onChange={(e) => onChange({ province: e.target.value })}>
          <option value="">Select…</option>
          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">{label}</span>
      {children}
    </label>
  );
}
```

- [ ] **Step 3: step-product.tsx**

```tsx
"use client";

import * as React from "react";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { QuoteFormState } from "./types";
import { CATEGORIES } from "./types";

interface Props {
  value: QuoteFormState;
  onChange: (patch: Partial<QuoteFormState>) => void;
}

export function StepProduct({ value, onChange }: Props) {
  function toggleCategory(slug: string) {
    onChange({
      categories: value.categories.includes(slug)
        ? value.categories.filter((c) => c !== slug)
        : [...value.categories, slug],
    });
  }
  return (
    <div className="space-y-8">
      <div>
        <p className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-3">Categories needed</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c.slug} selected={value.categories.includes(c.slug)} onClick={() => toggleCategory(c.slug)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>
      <Field label="Budget">
        <Select value={value.budget} onChange={(e) => onChange({ budget: e.target.value as QuoteFormState["budget"] })}>
          <option value="">Select…</option>
          <option value="<5k">Less than $5k</option>
          <option value="5-15k">$5–15k</option>
          <option value="15-50k">$15–50k</option>
          <option value="50k+">$50k+</option>
          <option value="not-sure">Not sure yet</option>
        </Select>
      </Field>
      <Field label="Need-by date (or 'Flexible')">
        <Input value={value.needBy} onChange={(e) => onChange({ needBy: e.target.value })} />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">{label}</span>
      {children}
    </label>
  );
}
```

- [ ] **Step 4: step-contact.tsx**

```tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { QuoteFormState } from "./types";

interface Props {
  value: QuoteFormState;
  onChange: (patch: Partial<QuoteFormState>) => void;
}

export function StepContact({ value, onChange }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Field label="Full name">
        <Input value={value.name} onChange={(e) => onChange({ name: e.target.value })} required />
      </Field>
      <Field label="Company / venue">
        <Input value={value.company} onChange={(e) => onChange({ company: e.target.value })} required />
      </Field>
      <Field label="Email">
        <Input type="email" value={value.email} onChange={(e) => onChange({ email: e.target.value })} required />
      </Field>
      <Field label="Phone">
        <Input type="tel" value={value.phone} onChange={(e) => onChange({ phone: e.target.value })} required />
      </Field>
      <Field label="Notes" className="md:col-span-2">
        <Textarea value={value.notes} onChange={(e) => onChange({ notes: e.target.value })} />
      </Field>
      <label className="md:col-span-2 flex items-start gap-3 text-sm text-[var(--color-ink-muted)]">
        <Checkbox checked={value.consent} onChange={(e) => onChange({ consent: e.target.checked })} required />
        <span>I agree to be contacted by Maison Banquet Co. about my quote.</span>
      </label>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value.honeypot}
        onChange={(e) => onChange({ honeypot: e.target.value })}
        className="hidden"
        aria-hidden
      />
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">{label}</span>
      {children}
    </label>
  );
}
```

- [ ] **Step 5: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/quote
git commit -m "feat(quote): 3-step components — event, product, contact"
```

---

### Task 51: Quote form orchestrator with sessionStorage persistence

**Files:**
- Create: `src/components/quote/quote-form.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepEvent } from "./step-event";
import { StepProduct } from "./step-product";
import { StepContact } from "./step-contact";
import { Turnstile } from "./turnstile";
import type { QuoteFormState } from "./types";

const INITIAL: QuoteFormState = {
  eventType: "", eventDate: "", headcount: "", city: "", province: "",
  categories: [], products: [], budget: "", needBy: "",
  name: "", company: "", email: "", phone: "", notes: "", consent: false,
  honeypot: "",
};

const STORAGE_KEY = "maison-banquet:quote-form";

export function QuoteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const stepParam = Number(params.get("step") ?? "1");
  const step = Number.isFinite(stepParam) && stepParam >= 1 && stepParam <= 3 ? stepParam : 1;

  const [state, setState] = React.useState<QuoteFormState>(INITIAL);
  const [turnstileToken, setTurnstileToken] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Hydrate from sessionStorage + URL prefills (?product=, ?notes=)
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
    const prefillProduct = params.get("product");
    const prefillNotes = params.get("notes");
    if (prefillProduct) {
      setState((s) => (s.products.includes(prefillProduct) ? s : { ...s, products: [...s.products, prefillProduct] }));
    }
    if (prefillNotes) {
      setState((s) => (s.notes ? s : { ...s, notes: prefillNotes }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change
  React.useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  function update(patch: Partial<QuoteFormState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  function goto(newStep: number) {
    router.push(`/quote?step=${newStep}`, { scroll: false });
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        source: "quote" as const,
        name: state.name,
        company: state.company,
        email: state.email,
        phone: state.phone,
        eventType: state.eventType || "other",
        eventDate: state.eventDate || "TBD",
        headcount: typeof state.headcount === "number" ? state.headcount : Number(state.headcount) || 0,
        city: state.city,
        province: state.province,
        categories: state.categories,
        products: state.products,
        budget: state.budget || "not-sure",
        needBy: state.needBy || "Flexible",
        notes: state.notes,
        consent: state.consent,
        honeypot: state.honeypot,
        turnstileToken,
      };
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      sessionStorage.removeItem(STORAGE_KEY);
      router.push("/quote/thanks");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <ol className="flex items-center gap-4 mb-12 text-xs uppercase tracking-wide">
        {["Event", "Product", "Contact"].map((label, i) => {
          const n = i + 1;
          const active = n === step;
          return (
            <li key={label} className={active ? "text-[var(--color-brand-gold)]" : "text-[var(--color-ink-muted)]"}>
              {n}. {label}
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {step === 1 && <StepEvent value={state} onChange={update} />}
          {step === 2 && <StepProduct value={state} onChange={update} />}
          {step === 3 && (
            <>
              <StepContact value={state} onChange={update} />
              <div className="mt-6">
                <Turnstile onVerify={setTurnstileToken} />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-6 text-sm text-red-400">Submission error: {error}</p>}

      <div className="mt-12 flex justify-between">
        <Button variant="ghost" size="md" disabled={step === 1} onClick={() => goto(step - 1)}>
          Back
        </Button>
        {step < 3 ? (
          <Button size="md" onClick={() => goto(step + 1)}>Next</Button>
        ) : (
          <Button
            size="md"
            disabled={submitting || !state.consent || !turnstileToken}
            onClick={submit}
          >
            {submitting ? "Sending…" : "Submit Request"}
          </Button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
npm run typecheck && npm run lint
git add src/components/quote/quote-form.tsx
git commit -m "feat(quote): 3-step form orchestrator with sessionStorage and turnstile"
```

---

### Task 52: /quote and /quote/thanks routes

**Files:**
- Create: `src/app/quote/page.tsx`
- Create: `src/app/quote/thanks/page.tsx`

- [ ] **Step 1: /quote page**

`src/app/quote/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { QuoteForm } from "@/components/quote/quote-form";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Tell us about your event. We'll come back within 24 hours with sourcing, pricing, and a delivery plan.",
};

export default function QuotePage() {
  return (
    <Container narrow className="py-24">
      <Eyebrow>Quote Request</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-5xl">Tell us about your event.</h1>
      <p className="mt-6 text-[var(--color-ink-muted)]">
        Three short steps. We reply within 24 hours.
      </p>
      <div className="mt-16">
        <Suspense fallback={null}>
          <QuoteForm />
        </Suspense>
      </div>
    </Container>
  );
}
```

- [ ] **Step 2: /quote/thanks page**

`src/app/quote/thanks/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thanks — your request is in",
  description: "We received your quote request and will reply within 24 hours.",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <Container narrow className="py-32 text-center">
      <Eyebrow>Received</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-5xl">Thanks — your request is in.</h1>
      <p className="mt-6 text-[var(--color-ink-muted)] text-lg">
        A member of our team will review the details and reply within 24 hours.
      </p>
      <div className="mt-12 flex justify-center gap-4">
        <Button asChild size="lg" variant="ghost">
          <Link href="/gallery">Browse the gallery</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Container>
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/app/quote
git commit -m "feat(quote): /quote and /quote/thanks routes"
```

---

### Task 53: Contact form + /contact route

**Files:**
- Create: `src/components/contact/contact-form.tsx`
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: ContactForm**

`src/components/contact/contact-form.tsx`:

```tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Turnstile } from "@/components/quote/turnstile";

export function ContactForm() {
  const router = useRouter();
  const [state, setState] = React.useState({ name: "", email: "", message: "", consent: false, honeypot: "" });
  const [token, setToken] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "contact", ...state, turnstileToken: token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      router.push("/quote/thanks");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">Name</span>
        <Input required value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} />
      </label>
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">Email</span>
        <Input type="email" required value={state.email} onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))} />
      </label>
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">Message</span>
        <Textarea required value={state.message} onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))} />
      </label>
      <label className="flex items-start gap-3 text-sm text-[var(--color-ink-muted)]">
        <Checkbox required checked={state.consent} onChange={(e) => setState((s) => ({ ...s, consent: e.target.checked }))} />
        <span>I agree to be contacted by Maison Banquet Co.</span>
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden
        value={state.honeypot} onChange={(e) => setState((s) => ({ ...s, honeypot: e.target.value }))} />
      <Turnstile onVerify={setToken} />
      {error && <p className="text-sm text-red-400">Submission error: {error}</p>}
      <Button size="lg" disabled={submitting || !token || !state.consent}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: /contact page**

`src/app/contact/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ContactForm } from "@/components/contact/contact-form";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Maison Banquet Co. — for quote requests, supplier inquiries, and general questions.",
};

export default function ContactPage() {
  return (
    <Container narrow className="py-24">
      <Eyebrow>Contact</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-5xl">Reach us.</h1>
      <p className="mt-6 text-[var(--color-ink-muted)]">
        For quote requests, please use the <a href="/quote" className="text-[var(--color-brand-gold)]">quote form</a>. For
        everything else, drop a note below.
      </p>
      <div className="mt-12 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <aside className="space-y-6 text-sm">
          <div>
            <p className="uppercase text-xs tracking-wide text-[var(--color-ink-muted)] mb-2">Email</p>
            <a href={`mailto:${brand.email}`} className="hover:text-[var(--color-brand-gold)]">{brand.email}</a>
          </div>
          <div>
            <p className="uppercase text-xs tracking-wide text-[var(--color-ink-muted)] mb-2">Phone</p>
            <a href={`tel:${brand.phone.replace(/\D/g, "")}`}>{brand.phone}</a>
          </div>
          <div>
            <p className="uppercase text-xs tracking-wide text-[var(--color-ink-muted)] mb-2">Service area</p>
            <p>{brand.serviceArea}</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/contact src/app/contact
git commit -m "feat(contact): /contact route with form posting to /api/lead"
```

---

## Phase J — SEO + Revalidate

### Task 54: seo/metadata helper (TDD)

**Files:**
- Test: `tests/unit/seo-metadata.test.ts`
- Create: `src/lib/seo/metadata.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import { metadataFromSeo } from "@/lib/seo/metadata";

describe("metadataFromSeo", () => {
  it("uses Sanity SEO fields when present", () => {
    const m = metadataFromSeo(
      { metaTitle: "Custom", metaDescription: "Custom desc" },
      { title: "Fallback", description: "Fallback desc" },
    );
    expect(m.title).toBe("Custom");
    expect(m.description).toBe("Custom desc");
  });

  it("falls back when Sanity SEO is missing", () => {
    const m = metadataFromSeo(undefined, { title: "Fallback", description: "Fallback desc" });
    expect(m.title).toBe("Fallback");
    expect(m.description).toBe("Fallback desc");
  });

  it("merges OG fields", () => {
    const m = metadataFromSeo(
      { metaTitle: "T", metaDescription: "D" },
      { title: "fallback", description: "fallback" },
    );
    expect(m.openGraph?.title).toBe("T");
    expect(m.openGraph?.description).toBe("D");
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm test -- seo-metadata
```

- [ ] **Step 3: Implement**

`src/lib/seo/metadata.ts`:

```ts
import type { Metadata } from "next";

interface SanitySeo {
  metaTitle?: string;
  metaDescription?: string;
}

interface Fallback {
  title: string;
  description: string;
}

export function metadataFromSeo(seo: SanitySeo | undefined, fallback: Fallback): Metadata {
  const title = seo?.metaTitle ?? fallback.title;
  const description = seo?.metaDescription ?? fallback.description;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
```

- [ ] **Step 4: Run, verify pass + commit**

```bash
npm test -- seo-metadata
git add src/lib/seo/metadata.ts tests/unit/seo-metadata.test.ts
git commit -m "feat(seo): metadataFromSeo helper with fallbacks"
```

---

### Task 55: sitemap + robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

(Use Next.js App Router's built-in metadata routes rather than `next-sitemap` — simpler, same outcome.)

- [ ] **Step 1: sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { getCategories, getGalleryItems } from "@/lib/sanity/queries";
import { sanity } from "@/lib/sanity/client";

const STATIC_PATHS = ["", "/catalog", "/gallery", "/quote", "/contact", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-banquet.vercel.app";

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    sanity.fetch<Array<{ slug: string; category: { slug: string } }>>(
      `*[_type == "product"]{ "slug": slug.current, "category": category->{ "slug": slug.current } }`,
    ),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1.0 : 0.7,
  }));

  const catEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/catalog/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = allProducts
    .filter((p) => p.category?.slug)
    .map((p) => ({
      url: `${base}/catalog/${p.category.slug}/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...catEntries, ...productEntries];
}
```

- [ ] **Step 2: robots.ts**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-banquet.vercel.app";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/", "/quote/thanks"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Update .env.example**

Append:

```
# Public site URL (used by sitemap/robots; set per env)
NEXT_PUBLIC_SITE_URL=
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Visit `/sitemap.xml` and `/robots.txt`. Expected: both render. Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts .env.example
git commit -m "feat(seo): dynamic sitemap and robots"
```

---

### Task 56: JSON-LD components — Organization (sitewide) + Product

**Files:**
- Create: `src/components/seo/json-ld.tsx`
- Create: `src/components/seo/organization-jsonld.tsx`
- Modify: `src/app/layout.tsx` (inject Organization JSON-LD)
- Modify: `src/app/catalog/[category]/[product]/page.tsx` (inject Product JSON-LD)

- [ ] **Step 1: Generic JsonLd**

`src/components/seo/json-ld.tsx`:

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: OrganizationJsonLd**

`src/components/seo/organization-jsonld.tsx`:

```tsx
import { JsonLd } from "./json-ld";
import { brand } from "@/lib/brand";

export function OrganizationJsonLd() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-banquet.vercel.app";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brand.name,
        url: base,
        email: brand.email,
        telephone: brand.phone,
        areaServed: "CA",
        description: brand.tagline,
      }}
    />
  );
}
```

- [ ] **Step 3: Inject in root layout**

In `src/app/layout.tsx`, add inside `<body>` before `<Header />`:

```tsx
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld";
// ...
<body className="flex flex-col min-h-dvh">
  <OrganizationJsonLd />
  <Header />
  ...
```

- [ ] **Step 4: Product JSON-LD in product page**

In `src/app/catalog/[category]/[product]/page.tsx`, after `notFound()` and before the return:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { urlFor } from "@/lib/sanity/image";

// ...inside ProductPage, after `if (!p) notFound();`
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.title,
  description: p.shortDescription,
  category: p.category.title,
  image: (p.images ?? [])
    .map((img) => urlFor(img)?.width(1200).url())
    .filter(Boolean) as string[],
};
```

And render it inside the JSX (e.g. at the top of the returned fragment):

```tsx
<JsonLd data={productJsonLd} />
```

- [ ] **Step 5: Verify + commit**

```bash
npm run typecheck && npm run lint
git add src/components/seo src/app/layout.tsx src/app/catalog/[category]/[product]/page.tsx
git commit -m "feat(seo): organization + product JSON-LD"
```

---

### Task 57: BreadcrumbList JSON-LD on catalog routes

**Files:**
- Modify: `src/app/catalog/[category]/page.tsx`
- Modify: `src/app/catalog/[category]/[product]/page.tsx`

- [ ] **Step 1: Category page breadcrumb**

In `src/app/catalog/[category]/page.tsx`, after fetching `cat`:

```tsx
import { JsonLd } from "@/components/seo/json-ld";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-banquet.vercel.app";
const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Catalog", item: `${base}/catalog` },
    { "@type": "ListItem", position: 2, name: cat.title, item: `${base}/catalog/${cat.slug}` },
  ],
};
```

Render inside the JSX:

```tsx
<JsonLd data={breadcrumb} />
```

- [ ] **Step 2: Product page breadcrumb**

Mirror in product page — add 3rd ListItem for the product.

- [ ] **Step 3: Commit**

```bash
npm run typecheck && npm run lint
git add src/app/catalog
git commit -m "feat(seo): BreadcrumbList JSON-LD on catalog routes"
```

---

### Task 58: /api/revalidate route

**Files:**
- Create: `src/app/api/revalidate/route.ts`

Sanity webhook fires when content changes. The route validates a shared secret and revalidates affected tags.

- [ ] **Step 1: Implement**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

interface SanityWebhookBody {
  _type?: string;
  slug?: { current?: string };
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as SanityWebhookBody;
  const type = body._type;
  const slug = body.slug?.current;

  const tags: string[] = [];
  switch (type) {
    case "category":
      tags.push("categories");
      if (slug) tags.push(`category:${slug}`);
      break;
    case "product":
      tags.push("featured");
      if (slug) tags.push(`product:${slug}`);
      break;
    case "galleryItem":
      tags.push("gallery");
      break;
    case "siteSettings":
      tags.push("siteSettings");
      break;
    case "legalPage":
      if (slug) tags.push(`legal:${slug}`);
      break;
    default:
      // unknown — revalidate everything cheap
      tags.push("categories", "featured", "gallery", "siteSettings");
  }

  for (const tag of tags) revalidateTag(tag);
  return NextResponse.json({ revalidated: tags });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/revalidate
git commit -m "feat(api): /api/revalidate sanity webhook target"
```

---

## Phase K — Seed Content, E2E, Perf

### Task 59: Seed JSON data files (10 categories, 20 products, 30 gallery)

**Files:**
- Create: `seed/categories.json`
- Create: `seed/products.json`
- Create: `seed/gallery-pexels.json`

The structure mirrors what Sanity expects. The seed script (Task 60) uploads images by URL.

- [ ] **Step 1: categories.json**

10 entries, one per spec category. Each references a Pexels image URL.

```json
[
  {
    "slug": "chiavari-chairs",
    "title": "Chiavari Chairs",
    "tagline": "The classic banquet chair, in every finish.",
    "heroImageUrl": "https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg",
    "order": 1
  },
  {
    "slug": "banquet-tables",
    "title": "Banquet Tables",
    "tagline": "Rounds and rectangles for any room.",
    "heroImageUrl": "https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg",
    "order": 2
  },
  {
    "slug": "chair-covers-and-sashes",
    "title": "Chair Covers & Sashes",
    "tagline": "Spandex and satin, every color, every fit.",
    "heroImageUrl": "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg",
    "order": 3
  },
  {
    "slug": "linens",
    "title": "Linens",
    "tagline": "Tablecloths, runners, napkins — by the case.",
    "heroImageUrl": "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
    "order": 4
  },
  {
    "slug": "charger-plates",
    "title": "Charger Plates",
    "tagline": "Acrylic, glass, and metal layers.",
    "heroImageUrl": "https://images.pexels.com/photos/1395972/pexels-photo-1395972.jpeg",
    "order": 5
  },
  {
    "slug": "centerpieces-and-florals",
    "title": "Centerpieces & Florals",
    "tagline": "Tall, low, and statement.",
    "heroImageUrl": "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg",
    "order": 6
  },
  {
    "slug": "stage-and-backdrop",
    "title": "Stage & Backdrop",
    "tagline": "Modular stages and shimmer walls.",
    "heroImageUrl": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg",
    "order": 7
  },
  {
    "slug": "dishes-and-glassware",
    "title": "Dishes & Glassware",
    "tagline": "Service-grade dinnerware and crystal.",
    "heroImageUrl": "https://images.pexels.com/photos/1395958/pexels-photo-1395958.jpeg",
    "order": 8
  },
  {
    "slug": "event-lighting",
    "title": "Event Lighting",
    "tagline": "Uplights, fairy strands, chandeliers.",
    "heroImageUrl": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg",
    "order": 9
  },
  {
    "slug": "pipe-and-drape",
    "title": "Pipe & Drape",
    "tagline": "Velvet, voile, and shimmer panels.",
    "heroImageUrl": "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg",
    "order": 10
  }
]
```

Note: image URLs above are illustrative. The executor should run a Pexels search per category and substitute high-quality matches before commit.

- [ ] **Step 2: products.json**

20 entries — 2 per category. Schema:

```json
[
  {
    "categorySlug": "chiavari-chairs",
    "slug": "gold-luxe-chiavari",
    "title": "Gold Luxe Chiavari",
    "shortDescription": "Resin gold-finish chiavari, ivory cushion, 12-stack height.",
    "specs": [
      { "label": "Material", "value": "Resin (commercial grade)" },
      { "label": "Finish", "value": "Gold leaf" },
      { "label": "Stack height", "value": "12 chairs" },
      { "label": "Weight", "value": "9.5 lbs" }
    ],
    "tags": ["gold", "stackable"],
    "featured": true,
    "imageUrls": ["https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg"]
  }
  // ... 19 more — fill in two per category
]
```

The executor fills in the remaining 19 entries — two per category, varied tags, ~6 marked `featured: true`.

- [ ] **Step 3: gallery-pexels.json**

30 entries:

```json
[
  {
    "title": "Ballroom dinner setup with gold chiavari",
    "imageUrl": "https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg",
    "tags": ["ballroom", "wedding"],
    "featured": true,
    "order": 1
  }
  // ... 29 more, mix of "wedding" / "corporate" / "outdoor" / "ballroom" tags
]
```

- [ ] **Step 4: Commit (placeholder values OK; refined during seed run)**

```bash
git add seed/
git commit -m "chore(seed): seed JSON files for categories, products, gallery"
```

---

### Task 60: Sanity seed script

**Files:**
- Create: `seed/seed-sanity.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Sanity write deps**

```bash
npm install -D tsx
```

(`@sanity/client` ships with `next-sanity`.)

- [ ] **Step 2: Write the seeder**

`seed/seed-sanity.ts`:

```ts
import { createClient } from "@sanity/client";
import categoriesJson from "./categories.json";
import productsJson from "./products.json";
import galleryJson from "./gallery-pexels.json";

interface CategorySeed { slug: string; title: string; tagline: string; heroImageUrl: string; order: number; }
interface ProductSeed { categorySlug: string; slug: string; title: string; shortDescription: string; specs: { label: string; value: string }[]; tags: string[]; featured: boolean; imageUrls: string[]; }
interface GallerySeed { title: string; imageUrl: string; tags: string[]; featured: boolean; order: number; }

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error("Need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN");
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-05-01", useCdn: false });

async function uploadImage(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch ${res.status}: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { contentType: res.headers.get("content-type") ?? "image/jpeg" });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function seedCategories() {
  const map = new Map<string, string>(); // slug -> _id
  for (const cat of categoriesJson as CategorySeed[]) {
    const heroImage = await uploadImage(cat.heroImageUrl);
    const doc = await client.createOrReplace({
      _id: `category-${cat.slug}`,
      _type: "category",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      tagline: cat.tagline,
      heroImage,
      order: cat.order,
    });
    map.set(cat.slug, doc._id);
    console.log(`category: ${cat.slug}`);
  }
  return map;
}

async function seedProducts(catMap: Map<string, string>) {
  for (const p of productsJson as ProductSeed[]) {
    const catId = catMap.get(p.categorySlug);
    if (!catId) throw new Error(`Unknown category slug: ${p.categorySlug}`);
    const images = [];
    for (const url of p.imageUrls) images.push(await uploadImage(url));
    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: "product",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: catId },
      shortDescription: p.shortDescription,
      specs: p.specs.map((s) => ({ _type: "spec", ...s })),
      tags: p.tags,
      featured: p.featured,
      images,
    });
    console.log(`product: ${p.slug}`);
  }
}

async function seedGallery() {
  for (const g of galleryJson as GallerySeed[]) {
    const image = await uploadImage(g.imageUrl);
    await client.createOrReplace({
      _id: `gallery-${g.order}`,
      _type: "galleryItem",
      title: g.title,
      image,
      tags: g.tags,
      featured: g.featured,
      order: g.order,
    });
    console.log(`gallery: ${g.title}`);
  }
}

async function seedSiteSettings() {
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    phone: "+1 (000) 000-0000",
    email: "hello@maisonbanquet.example",
    serviceAreaCopy: "Shipping across Canada",
    headerCtaLabel: "Request a Quote",
  });
  console.log("siteSettings seeded");
}

async function main() {
  const catMap = await seedCategories();
  await seedProducts(catMap);
  await seedGallery();
  await seedSiteSettings();
  console.log("Seed complete.");
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Add seed script**

In `package.json` scripts:

```json
"seed": "tsx seed/seed-sanity.ts"
```

- [ ] **Step 4: Acquire a write token**

Go to `https://www.sanity.io/manage` → project → API → Tokens → **Add** with **Editor** permissions → copy. Set in `.env.local`:

```
SANITY_WRITE_TOKEN=<paste editor token>
```

(Do not commit this. It's not in `.env.example` because it's a one-off ops secret, not a runtime secret.)

- [ ] **Step 5: Run the seed**

```bash
npm run seed
```

Expected: 10 category, 20 product, 30 gallery, 1 siteSettings creations logged. Visit `http://localhost:3000/studio` and verify content appears.

- [ ] **Step 6: Commit**

```bash
git add seed/seed-sanity.ts package.json package-lock.json
git commit -m "chore(seed): sanity seeder for categories, products, gallery"
```

---

### Task 61: End-to-end Playwright suite

**Files:**
- Modify: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/catalog.spec.ts`
- Create: `tests/e2e/gallery.spec.ts`
- Create: `tests/e2e/quote-form.spec.ts`

- [ ] **Step 1: Expand home.spec.ts**

```ts
import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("renders hero with primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /request a quote/i })).toBeVisible();
  });

  test("category grid links to /catalog/[slug]", async ({ page }) => {
    await page.goto("/");
    const firstCategoryLink = page.locator('a[href^="/catalog/"]').first();
    await expect(firstCategoryLink).toBeVisible();
    const href = await firstCategoryLink.getAttribute("href");
    expect(href).toMatch(/^\/catalog\/[a-z-]+/);
  });

  test("footer has legal links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Terms" })).toBeVisible();
  });
});
```

- [ ] **Step 2: catalog.spec.ts**

```ts
import { test, expect } from "@playwright/test";

test("catalog index lists 10 categories", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const links = page.locator('a[href^="/catalog/"]');
  await expect(links).toHaveCount(10);
});

test("category page lists products and supports tag filter", async ({ page }) => {
  await page.goto("/catalog/chiavari-chairs");
  await expect(page.getByRole("heading", { level: 1, name: /chiavari/i })).toBeVisible();
});

test("product detail shows spec sheet and quote CTA", async ({ page }) => {
  await page.goto("/catalog/chiavari-chairs/gold-luxe-chiavari");
  await expect(page.getByRole("heading", { level: 1, name: /chiavari/i })).toBeVisible();
  const quoteCta = page.getByRole("link", { name: /request a quote/i }).first();
  await expect(quoteCta).toBeVisible();
  const href = await quoteCta.getAttribute("href");
  expect(href).toContain("/quote?product=");
});
```

- [ ] **Step 3: gallery.spec.ts**

```ts
import { test, expect } from "@playwright/test";

test("gallery opens lightbox on click", async ({ page }) => {
  await page.goto("/gallery");
  await page.locator("button").filter({ has: page.locator("img") }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
```

- [ ] **Step 4: quote-form.spec.ts (with API mocked)**

```ts
import { test, expect } from "@playwright/test";

test("quote form happy path posts to /api/lead and redirects to thanks", async ({ page }) => {
  await page.route("**/api/lead", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );

  await page.goto("/quote");
  // Step 1
  await page.getByLabel(/Event type/i).selectOption("wedding");
  await page.getByLabel(/Event date/i).fill("2026-09-12");
  await page.getByLabel(/Headcount/i).fill("220");
  await page.getByLabel(/Delivery city/i).fill("Toronto");
  await page.getByLabel(/Province/i).selectOption("ON");
  await page.getByRole("button", { name: /next/i }).click();

  // Step 2 — pick one category, pick budget + needBy
  await page.getByRole("button", { name: /chiavari chairs/i }).click();
  await page.getByLabel(/Budget/i).selectOption("15-50k");
  await page.getByLabel(/Need-by/i).fill("Flexible");
  await page.getByRole("button", { name: /next/i }).click();

  // Step 3
  await page.getByLabel(/Full name/i).fill("Jane Doe");
  await page.getByLabel(/Company/i).fill("Northwood Banquet Hall");
  await page.getByLabel(/Email/i).fill("jane@northwood.com");
  await page.getByLabel(/Phone/i).fill("416-555-0100");
  await page.getByText(/I agree to be contacted/).click();

  // Turnstile is in dev-bypass mode; click submit
  await page.getByRole("button", { name: /submit request/i }).click();
  await expect(page).toHaveURL(/\/quote\/thanks$/);
});
```

- [ ] **Step 5: Run all e2e**

```bash
npm run test:e2e
```

Expected: all green. Investigate any failures before commit.

- [ ] **Step 6: Commit**

```bash
git add tests/e2e
git commit -m "test(e2e): home, catalog, gallery, quote-form playwright suite"
```

---

### Task 62: Lighthouse gate

**Files:**
- Modify: `README.md` (add manual perf check step)

Lighthouse runs via Chrome DevTools or `npx lighthouse`. Gate Home and one Product Detail page at Performance ≥ 95.

- [ ] **Step 1: Run Lighthouse against Home**

```bash
npm run build
npm start
```

Different terminal:

```bash
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo --quiet --output=json --output-path=./lh-home.json
```

Inspect the JSON. Expected:
- performance score ≥ 0.95
- accessibility ≥ 0.95
- seo ≥ 1.0

- [ ] **Step 2: Same for a product page**

```bash
npx lighthouse http://localhost:3000/catalog/chiavari-chairs/gold-luxe-chiavari --only-categories=performance,accessibility,seo --quiet --output=json --output-path=./lh-product.json
```

- [ ] **Step 3: If scores < target — diagnose**

Common fixes:
- Unoptimized images: ensure `<Image>` is used everywhere with explicit `sizes`.
- Large hero image: add `priority` and `<link rel="preload" as="image">`.
- Font flash: ensure `display: "swap"` and `next/font` is used (already done in Task 16).
- JS bundle: check `next build` output for any unusually large route segment.

- [ ] **Step 4: Capture results in README**

Append to `README.md`:

```md
## Performance baseline (verified <date>)

| Route | Performance | Accessibility | SEO |
|---|---|---|---|
| / | 0.NN | 0.NN | 1.0 |
| /catalog/chiavari-chairs/gold-luxe-chiavari | 0.NN | 0.NN | 1.0 |

Re-run: `npm run build && npm start && npx lighthouse <url>`.
```

- [ ] **Step 5: Clean up reports + commit**

```bash
rm lh-home.json lh-product.json
git add README.md
git commit -m "docs(perf): lighthouse baseline notes"
```

---

## Phase L — Deploy, SOPs, Memory

### Task 63: Vercel deploy + env vars

**Files:**
- Modify: `package.json` (build script already in place)
- No code changes; produces a preview URL

- [ ] **Step 1: Push the project to a Git remote**

Create a GitHub repository (private), then:

```bash
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Create Vercel project**

In the Vercel dashboard: New Project → Import the GitHub repo → Framework: Next.js (auto-detected) → Root directory: `projects/banquet-import-site` (if the repo is the Playground monorepo) or `.` (if banquet-import-site is its own repo).

- [ ] **Step 3: Wire env vars**

Add every variable from `.env.example` to Vercel Project Settings → Environment Variables, against both Production and Preview:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_READ_TOKEN`
- `SANITY_WEBHOOK_SECRET` (pick a random ≥32-char string)
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_SHEET_ID`
- `RESEND_API_KEY`
- `LEAD_NOTIFY_EMAIL`
- `LEAD_FROM_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `AGENT_WEBHOOK_URL` (leave blank)
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://<project>.vercel.app` for now)

- [ ] **Step 4: Deploy**

In Vercel: Deployments → Redeploy. Wait for the build to complete (~2 min).

- [ ] **Step 5: Verify**

Open the preview URL. Walk through: home, /catalog, one product, /gallery, /quote (step through but don't submit), /contact. All routes render with seeded Sanity data. `/studio` opens Studio.

- [ ] **Step 6: No commit needed**

(All changes were dashboard config, not code.)

---

### Task 64: Wire Sanity → /api/revalidate webhook

**Files:**
- Documentation only

- [ ] **Step 1: Configure webhook in Sanity**

`https://www.sanity.io/manage` → project → API → Webhooks → Add:

- **Name:** `vercel-revalidate-prod`
- **URL:** `https://<vercel-prod-url>/api/revalidate`
- **Dataset:** `production`
- **Trigger on:** Create, Update, Delete
- **Filter:** `_type in ["category","product","galleryItem","siteSettings","legalPage"]`
- **Projection:** `{ _type, slug }`
- **HTTP method:** POST
- **Headers:** `x-webhook-secret: <value of SANITY_WEBHOOK_SECRET>`

- [ ] **Step 2: Test**

In Studio, edit a category title. Within ~5s the production site should reflect the change after a refresh.

- [ ] **Step 3: Document in SOP**

Will be captured in `docs/sops/sanity-setup.md` expansion in Task 65.

---

### Task 65: SOP — Sanity setup (expanded)

**Files:**
- Modify: `docs/sops/sanity-setup.md`

- [ ] **Step 1: Expand the SOP**

Replace contents:

```markdown
# Sanity Setup — One-Time

## Create the project

1. `npx --yes create-sanity@latest --output-path=tmp-sanity --typescript --template clean`
2. Choose "Create new project" — copy the project ID from CLI output.
3. Discard `tmp-sanity` — schemas live in `src/studio/`.

## Env vars

In `.env.local` and Vercel project settings:

- `NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_READ_TOKEN=<Viewer token, generate at sanity.io/manage>`
- `SANITY_WEBHOOK_SECRET=<random ≥32 chars; you choose>`

For seeding only:

- `SANITY_WRITE_TOKEN=<Editor token>` (local `.env.local` only — do NOT add to Vercel)

## Embedded Studio

The Studio runs at `/studio`. First visit requires browser login with your Sanity account.

## Revalidate webhook

In Sanity Manage → API → Webhooks → Add:
- URL: `https://<vercel-url>/api/revalidate`
- Trigger: Create + Update + Delete
- Filter: `_type in ["category","product","galleryItem","siteSettings","legalPage"]`
- Projection: `{ _type, slug }`
- Header: `x-webhook-secret: <SANITY_WEBHOOK_SECRET>`

## Seeding

1. Set `SANITY_WRITE_TOKEN` in `.env.local`.
2. `npm run seed`.
3. Verify in Studio.
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/sanity-setup.md
git commit -m "docs(sop): expand sanity setup with webhook + seed instructions"
```

---

### Task 66: SOP — Google Sheets setup

**Files:**
- Create: `docs/sops/sheets-setup.md`

- [ ] **Step 1: Write it**

```markdown
# Google Sheets Lead Capture — One-Time Setup

## 1. Create the sheet

1. Google Drive → New → Google Sheets → name it **"Maison Banquet — Leads"**.
2. Copy the sheet ID from the URL: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`.
3. Set `GOOGLE_SHEET_ID=<SHEET_ID>` in `.env.local` (and Vercel env vars).

## 2. Add the header row

Paste into row 1:

```
timestamp | source | name | company | email | phone | event_type | event_date | headcount | city | province | categories | products | budget | need_by | notes | utm_source | utm_medium | utm_campaign | ip_country
```

(Tab-separated when pasting.)

## 3. Create a service account

1. https://console.cloud.google.com → pick or create a project.
2. APIs & Services → Library → enable **Google Sheets API**.
3. APIs & Services → Credentials → Create Credentials → Service Account.
   - Name: `maison-banquet-leads`
   - Skip role grants (no project-level access needed).
4. After creation: Keys tab → Add key → JSON → download.

## 4. Share the sheet with the service account

Open the JSON key. Copy the `client_email` value (e.g. `maison-banquet-leads@<project>.iam.gserviceaccount.com`).
In the Sheet → Share → paste the email → **Editor**.

## 5. Encode the JSON key for the env var

Local (PowerShell):

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

Mirror into Vercel env vars.

## 6. Smoke test

```bash
npm run dev
```

Submit `/quote` end-to-end. Open the sheet → confirm a row landed in row 2.
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/sheets-setup.md
git commit -m "docs(sop): google sheets lead capture setup"
```

---

### Task 67: SOP — Resend + Turnstile

**Files:**
- Create: `docs/sops/resend-setup.md`
- Create: `docs/sops/turnstile-setup.md`

- [ ] **Step 1: Resend SOP**

`docs/sops/resend-setup.md`:

```markdown
# Resend (Transactional Email) — One-Time Setup

## 1. Account + API key

1. https://resend.com → sign up.
2. API Keys → Create → permission `Sending access`. Copy.
3. Set in `.env.local` + Vercel:
   - `RESEND_API_KEY=<paste>`

## 2. From-address

Until a real domain is verified, the from-address falls back to `Maison Banquet <noreply@maisonbanquet.example>` and Resend may reject. Two options:

**A. (Recommended for v1) Use Resend's onboarding sandbox domain**

Set `LEAD_FROM_EMAIL="Maison Banquet <onboarding@resend.dev>"`. Works without verification; emails will be delivered but show that from-address.

**B. Verify the real domain**

In Resend → Domains → Add `maisonbanquet.com` (or whatever the real domain will be). Follow the DNS instructions. Once verified, set:

```
LEAD_FROM_EMAIL="Maison Banquet <noreply@<real-domain>>"
```

## 3. Internal notify destination

```
LEAD_NOTIFY_EMAIL=hardeep.singh@futurewavesol.com
```

## 4. Smoke test

Submit a lead via `/quote`. Confirm both emails arrive: one to `LEAD_NOTIFY_EMAIL` (internal), one to the email you typed in the form (auto-reply).
```

- [ ] **Step 2: Turnstile SOP**

`docs/sops/turnstile-setup.md`:

```markdown
# Cloudflare Turnstile — One-Time Setup

## 1. Site + secret keys

1. https://dash.cloudflare.com → Turnstile → Add a site.
2. Domain: leave blank for "any domain" while developing, or add `vercel.app` + your prod domain.
3. Widget Mode: **Managed**.
4. Copy **Site Key** and **Secret Key**.
5. Set in `.env.local` + Vercel:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<paste>
TURNSTILE_SECRET_KEY=<paste>
```

## 2. Dev fallback

If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset, the form bypasses Turnstile in the browser (sends `dev-bypass-token`). The server-side `verifyTurnstile` will reject it unless `TURNSTILE_SECRET_KEY` is also unset (returns `false` → 400). So:

- Both set → Turnstile enforced.
- Both unset → form submission rejected with `turnstile-failed`. Set both, or override the server route during local-only dev.
```

- [ ] **Step 3: Commit**

```bash
git add docs/sops/resend-setup.md docs/sops/turnstile-setup.md
git commit -m "docs(sop): resend and turnstile setup"
```

---

### Task 68: SOP — Deploy to Vercel + Promote to live

**Files:**
- Create: `docs/sops/deploy-to-vercel.md`
- Create: `docs/sops/promote-to-live.md`

- [ ] **Step 1: deploy-to-vercel.md**

```markdown
# Deploy to Vercel — One-Time

## 1. Push to GitHub

1. Create a private GitHub repo.
2. `git remote add origin <repo-url> && git push -u origin main`.

## 2. Create Vercel project

1. https://vercel.com → New Project → Import the repo.
2. Framework: Next.js (auto).
3. Root directory: `projects/banquet-import-site` (if monorepo) or `.` (if standalone).

## 3. Add env vars

Paste every var from `.env.example` into Settings → Environment Variables — both Production and Preview environments. Skip `SANITY_WRITE_TOKEN` (local-only).

For `NEXT_PUBLIC_SITE_URL`, set to the Vercel-assigned URL until a real domain is attached.

## 4. Trigger deploy

Push to `main`. Verify the build logs and open the preview URL.

## 5. Verify post-deploy

- `/` renders with seeded content
- `/catalog/chiavari-chairs/gold-luxe-chiavari` renders
- `/studio` opens
- `/api/lead` rejects an empty POST with 400
- `/sitemap.xml` returns the expected URL list
- `/robots.txt` blocks `/studio` and `/api/`
```

- [ ] **Step 2: promote-to-live.md**

```markdown
# Promote to Live — Checklist

Do not run until the placeholder brand has been replaced and content reviewed.

## 1. Brand swap

- [ ] Edit `src/lib/brand.ts` — replace placeholder name, tagline, email, phone with real values. Set `isPlaceholder: false`.
- [ ] Update Sanity `siteSettings` with real phone/email.
- [ ] Replace `public/og-default.jpg` with branded OG image.
- [ ] Update favicon at `src/app/favicon.ico` (or `public/favicon.ico`).

## 2. Legal copy

- [ ] Fill in real Privacy and Terms via Studio → Legal Page documents (slugs `privacy`, `terms`).

## 3. Domain

- [ ] Register the domain.
- [ ] Vercel → Project → Domains → Add → follow DNS instructions.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://<real-domain>` in Production env vars.
- [ ] Verify `/sitemap.xml` uses the real URL.

## 4. Resend domain verification

- [ ] Add and verify the real domain in Resend.
- [ ] Update `LEAD_FROM_EMAIL` to use the real domain.

## 5. Turnstile

- [ ] Add the real domain in Turnstile → Sites.

## 6. Final perf check

- [ ] `npm run build && npm start && npx lighthouse https://<real-domain>` — confirm ≥95.

## 7. Final smoke

- [ ] Submit a real test quote — verify Sheets row + both emails arrive.
- [ ] Check Vercel Analytics enabled.

## 8. Announce
```

- [ ] **Step 3: Commit**

```bash
git add docs/sops/deploy-to-vercel.md docs/sops/promote-to-live.md
git commit -m "docs(sop): deploy + promote-to-live checklists"
```

---

### Task 69: SOP — Add a product (for future non-technical helpers)

**Files:**
- Create: `docs/sops/add-product.md`

- [ ] **Step 1: Write it**

```markdown
# Add a Product — Studio Walkthrough

This is the supplied procedure for adding a new product without touching code.

## 1. Open the Studio

Browse to `https://<site>/studio`. Log in with your Sanity account.

## 2. New product

Left sidebar → **Product** → "+ Create new Product".

## 3. Fill the fields

| Field | What to enter |
|---|---|
| Title | Product display name, e.g. "Silver Mirror Charger" |
| Slug | Auto-generated from title — adjust if needed |
| Category | Pick from the dropdown (must exist) |
| Short description | 1-2 sentences, used on cards. Max ~180 chars. |
| Description | Rich text — full product copy |
| Images | Drag in 1-8 images. First image is the primary. |
| Specs | "+ Add item" for each label/value pair (Material, Finish, Dimensions, …) |
| Tags | Free-form tags. Reuse existing ones for consistency. |
| Featured | Check if you want this product on the Home featured carousel |
| Internal notes | Private — not rendered |
| SEO | Optional. Fill if you want a custom meta title/description |

## 4. Publish

Click **Publish** in the bottom-right. Within ~5 seconds the site updates automatically (via the revalidate webhook).

## 5. Verify

Visit `https://<site>/catalog/<category-slug>/<product-slug>`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/sops/add-product.md
git commit -m "docs(sop): how to add a product via studio"
```

---

### Task 70: Memory entry

**Files:**
- Create: `c:\Users\hrakk\OneDrive\Claude\Playground\memory\project_banquet_import_site.md`
- Modify: `c:\Users\hrakk\OneDrive\Claude\Playground\memory\MEMORY.md`

- [ ] **Step 1: Write the memory file**

`memory/project_banquet_import_site.md`:

```markdown
---
name: project-banquet-import-site
description: Maison Banquet Co. — luxury B2B banquet-furnishings import site. Next.js + Sanity + Sheets lead capture. Demo-that-promotes-to-live.
metadata:
  type: project
---

Project: Maison Banquet Co. (working placeholder name; swap before promotion).

Repo location: `projects/banquet-import-site/`.
Spec: `projects/banquet-import-site/docs/superpowers/specs/2026-05-19-maison-banquet-website-design.md`.
Plan: `projects/banquet-import-site/docs/superpowers/plans/2026-05-19-maison-banquet-website.md`.

Stack: Next.js 15 (App Router) · TS strict · Tailwind v4 · Framer Motion · Sanity v3 (Studio at /studio) · Resend · Google Sheets via service account · Cloudflare Turnstile · Vercel.

Constraints / decisions:
- **Brand is placeholder** — `lib/brand.ts` is the single swap-point. `isPlaceholder: true` until promotion.
- Lead capture posts to Google Sheets (no CRM). Agent-ready hook via `AGENT_WEBHOOK_URL` env var, empty in v1 — user will build agents later.
- No price, no MOQ, no SKU on public product pages. Quote-driven.
- Pexels for v1 imagery, swap to real supplier photography pre-promotion.
- Categories: 10 (Chiavari Chairs, Banquet Tables, Chair Covers & Sashes, Linens, Charger Plates, Centerpieces & Florals, Stage & Backdrop, Dishes & Glassware, Event Lighting, Pipe & Drape — no Dance Floors).
- Nationwide Canada positioning.
- Deferred v2: AI chatbot, AI quote assistant, programmatic SEO city pages, blog, WhatsApp, e-commerce, multilingual.

Where things live:
- Sanity schemas → `src/studio/schemas/`
- GROQ queries → `src/lib/sanity/queries.ts` (only file that writes GROQ)
- Lead pipeline → `src/lib/leads/` (schema, submit, sheets, emails, webhook, turnstile)
- SOPs → `docs/sops/`

See [[project_brand_folder_structure]] for how this fits alongside other Playground projects.
```

- [ ] **Step 2: Add to MEMORY.md**

Insert under "Active Projects":

```
- [project_banquet_import_site.md](project_banquet_import_site.md) — Maison Banquet Co. luxury B2B import site, Sanity-driven, Sheets lead capture, agent-ready
```

- [ ] **Step 3: Commit**

The memory directory is outside the project repo. From the Playground root:

```bash
cd ../..  # or wherever Playground/ is
git status memory/  # only if Playground is itself a repo; otherwise these files are untracked
```

If Playground is git-tracked, commit there. If not, just save the files — Claude's auto-memory loads them by path.

---

## Plan Coverage Map (spec → tasks)

| Spec section | Implemented by |
|---|---|
| §1 Context & Goal | All — single coherent v1 |
| §2 Tech Stack | Tasks 1, 3, 4, 5, 7, 10, 17, 18, 20, 44, 45 |
| §3.1 Routes | Tasks 25, 32, 34, 35, 38, 40, 52, 53, 11, 48, 58 |
| §3.2 No About page (Home #process) | Task 29 (ProcessStrip with `id="process"`) |
| §3.3 Global navigation | Tasks 22, 23 |
| §3.4 Category seed list | Task 50 (CATEGORIES), Task 59 (categories.json) |
| §3.5 SEO baseline | Tasks 54, 55, 56, 57 |
| §4 Sanity Data Model | Tasks 11–14 |
| §5 Page composition | Tasks 26–32, 34–38, 40 |
| §6 Visual Design System | Tasks 7, 16, 17, 18, 19, 20, 21 |
| §7 Lead Capture Pipeline | Tasks 41–48 |
| §8 Performance, SEO, Operations | Tasks 54–58, 62, 63 |
| §9 Out-of-Scope (v2+) | (Deferred — not in plan, documented in spec) |
| §10 Architectural Boundaries | Reflected in all relevant tasks (queries.ts as sole GROQ writer, submit.ts server-only, brand.ts as swap-point) |
| §11 Documentation & SOPs | Tasks 65, 66, 67, 68, 69 |
| §12 Success Criteria | Verified by Tasks 59, 60, 61, 62, 63, 64 |












