import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/sanity/queries";
import { sanity } from "@/lib/sanity/client";

const STATIC_PATHS = ["", "/catalog", "/gallery", "/quote", "/contact", "/privacy", "/terms"];

interface ProductRef {
  slug: string;
  category: { slug: string } | null;
}

interface CategoryRef {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-banquet.vercel.app";

  const [categories, allProducts] = await Promise.all([
    getCategories() as Promise<CategoryRef[]>,
    sanity.fetch<ProductRef[]>(
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
      url: `${base}/catalog/${p.category!.slug}/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...catEntries, ...productEntries];
}
