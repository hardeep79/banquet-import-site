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
