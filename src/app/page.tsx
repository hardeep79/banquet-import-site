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
