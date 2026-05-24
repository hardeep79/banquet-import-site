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
