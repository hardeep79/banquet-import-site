# Add a Product — Studio Walkthrough

Use this when you (or a non-technical helper) need to add a new product without touching code.

## 1. Open the Studio

Browse to `https://<site>/studio`. Log in with your Sanity account.

## 2. New product

Left sidebar → **Product** → **+ Create new Product**.

## 3. Fill the fields

| Field | What to enter |
|---|---|
| Title | Product display name, e.g. "Silver Mirror Charger" |
| Slug | Auto-generated from title — adjust if needed (URL-safe, lowercase, hyphens) |
| Category | Pick from the dropdown (must exist) |
| Short description | 1-2 sentences. Used on product cards. Max ~180 chars. |
| Description | Rich text — full product copy with paragraphs |
| Images | Drag in 1-8 images. First image is the primary shown on cards. |
| Specs | "+ Add item" for each label/value pair: Material, Finish, Dimensions, Stack height, etc. |
| Tags | Free-form tags for filtering. Reuse existing ones for consistency (e.g. `gold`, `stackable`). |
| Featured | Check to surface on the Home featured carousel |
| Internal notes | Private — not rendered on the site. Use for supplier notes, MOQ, cost basis, etc. |
| SEO | Optional. Fill if you want a custom meta title/description; otherwise the site uses Title + Short Description. |

## 4. Publish

Click **Publish** (bottom-right). Within ~5 seconds the site updates automatically via the revalidate webhook.

## 5. Verify

Visit `https://<site>/catalog/<category-slug>/<product-slug>` — the product detail page should render with images, specs, and the Request-a-Quote CTA.

## 6. Edit later

Same Studio → Product list → click the product → edit → Publish. Same revalidate flow applies.

## Common mistakes

- **Forgetting to set the Category reference.** Without it, the GROQ query can't resolve the parent path; the product is unreachable.
- **No images.** The product card and gallery will appear broken. Add at least one.
- **Slug collision.** If two products share a slug under the same category, the GROQ query returns the first. Make slugs unique.
