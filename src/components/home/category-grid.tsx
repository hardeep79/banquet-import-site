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
  if (categories.length === 0) return null;
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
