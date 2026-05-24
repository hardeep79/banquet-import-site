import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { SpecSheet } from "@/components/catalog/spec-sheet";
import { ProductCard } from "@/components/catalog/product-card";
import { getProduct, getCategory } from "@/lib/sanity/queries";
import { JsonLd } from "@/components/seo/json-ld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ category: string; product: string }>;
}

interface SanityProductDoc {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: unknown;
  images?: unknown[];
  specs?: { label: string; value: string }[];
  tags?: string[];
  seo?: { metaTitle?: string; metaDescription?: string };
  category: { title: string; slug: string };
}

interface SanityCategoryShallow {
  products?: Array<{
    _id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    images?: unknown[];
    tags?: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, product } = await params;
  const p = (await getProduct(category, product)) as SanityProductDoc | null;
  if (!p) return {};
  return {
    title: p.seo?.metaTitle ?? p.title,
    description: p.seo?.metaDescription ?? p.shortDescription,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { category, product } = await params;
  const p = (await getProduct(category, product)) as SanityProductDoc | null;
  if (!p) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.shortDescription,
    category: p.category.title,
    image: (p.images ?? [])
      .map((img) => urlFor(img)?.width(1200).url())
      .filter((u): u is string => Boolean(u)),
  };

  // Related: fetch the category's product list and exclude self.
  const cat = (await getCategory(category)) as SanityCategoryShallow | null;
  const related = (cat?.products ?? []).filter((rp) => rp.slug !== p.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={productJsonLd} />
      <Container className="pt-12 pb-24">
        <nav className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-8">
          <Link href="/catalog" className="hover:text-[var(--color-brand-gold)]">Catalog</Link>
          <span> · </span>
          <Link
            href={`/catalog/${p.category.slug}`}
            className="hover:text-[var(--color-brand-gold)]"
          >
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
            <h2 className="font-[var(--font-display)] text-3xl mb-10">
              More from {p.category.title}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard
                  key={r._id}
                  product={{
                    ...r,
                    category: { slug: p.category.slug, title: p.category.title },
                  }}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
