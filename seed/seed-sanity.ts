import { createClient } from "@sanity/client";
import categoriesJson from "./categories.json";
import productsJson from "./products.json";
import galleryJson from "./gallery-pexels.json";

interface CategorySeed {
  slug: string;
  title: string;
  tagline: string;
  heroImageUrl: string;
  order: number;
}
interface ProductSeed {
  categorySlug: string;
  slug: string;
  title: string;
  shortDescription: string;
  specs: { label: string; value: string }[];
  tags: string[];
  featured: boolean;
  imageUrls: string[];
}
interface GallerySeed {
  title: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
  order: number;
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error("Need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env.local");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-05-01",
  useCdn: false,
});

async function uploadImage(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch ${res.status}: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    contentType: res.headers.get("content-type") ?? "image/jpeg",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function seedCategories() {
  const map = new Map<string, string>();
  const cats = categoriesJson as CategorySeed[];
  for (let i = 0; i < cats.length; i++) {
    const cat = cats[i]!;
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
    console.log(`category ${i + 1}/${cats.length}: ${cat.slug}`);
  }
  return map;
}

async function seedProducts(catMap: Map<string, string>) {
  const products = productsJson as ProductSeed[];
  for (let i = 0; i < products.length; i++) {
    const p = products[i]!;
    const catId = catMap.get(p.categorySlug);
    if (!catId) throw new Error(`Unknown category slug: ${p.categorySlug}`);
    const images = [] as Array<{ _type: "image"; _key: string; asset: { _type: "reference"; _ref: string } }>;
    for (let j = 0; j < p.imageUrls.length; j++) {
      const url = p.imageUrls[j]!;
      const img = await uploadImage(url);
      images.push({ ...img, _key: `img-${j}` } as typeof images[number]);
    }
    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: "product",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: catId },
      shortDescription: p.shortDescription,
      specs: p.specs.map((s, k) => ({ _type: "spec", _key: `spec-${k}`, ...s })),
      tags: p.tags,
      featured: p.featured,
      images,
    });
    console.log(`product ${i + 1}/${products.length}: ${p.slug}`);
  }
}

async function seedGallery() {
  const items = galleryJson as GallerySeed[];
  for (let i = 0; i < items.length; i++) {
    const g = items[i]!;
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
    console.log(`gallery ${i + 1}/${items.length}: ${g.title}`);
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
