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

interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  heroImage?: unknown;
  seo?: { metaTitle?: string; metaDescription?: string };
  products?: Array<{
    _id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    images?: unknown[];
    tags?: string[];
    featured?: boolean;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = (await getCategory(category)) as SanityCategory | null;
  if (!cat) return {};
  return {
    title: cat.seo?.metaTitle ?? cat.title,
    description: cat.seo?.metaDescription ?? cat.tagline,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = (await getCategory(category)) as SanityCategory | null;
  if (!cat) notFound();

  const heroSrc = urlFor(cat.heroImage)?.width(1600).height(900).url();

  return (
    <>
      {heroSrc && (
        <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
          <Image
            src={heroSrc}
            alt={cat.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-canvas)]/40 to-[var(--color-bg-canvas)]" />
        </section>
      )}
      <section className="py-16">
        <Container narrow>
          <nav className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-4">
            <Link href="/catalog" className="hover:text-[var(--color-brand-gold)]">
              Catalog
            </Link>
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
