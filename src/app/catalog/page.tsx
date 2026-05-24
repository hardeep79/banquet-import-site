import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CategoryCard } from "@/components/catalog/category-card";
import { Reveal } from "@/components/motion/reveal";
import { getCategories } from "@/lib/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse every category of banquet furnishings we import — chiavari chairs, banquet tables, linens, dishware, lighting, and more.",
};

interface Category {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  heroImage?: unknown;
}

export default async function CatalogPage() {
  const categories = (await getCategories()) as Category[];
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
