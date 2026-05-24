"use client";

import * as React from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { FilterChips } from "@/components/catalog/filter-chips";
import { Reveal } from "@/components/motion/reveal";

interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  images?: unknown[];
  tags?: string[];
}

interface Props {
  categorySlug: string;
  categoryTitle: string;
  products: Product[];
}

export function CategoryProducts({ categorySlug, categoryTitle, products }: Props) {
  const allTags = React.useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.tags ?? []))).sort(),
    [products],
  );
  const [active, setActive] = React.useState<string | null>(null);
  const visible = active === null ? products : products.filter((p) => p.tags?.includes(active));

  return (
    <>
      {allTags.length > 0 && (
        <div className="mb-10">
          <FilterChips tags={allTags} value={active} onChange={setActive} />
        </div>
      )}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={p._id} delay={(i % 3) * 0.06}>
            <ProductCard
              product={{ ...p, category: { slug: categorySlug, title: categoryTitle } }}
            />
          </Reveal>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="text-[var(--color-ink-muted)]">No items match this filter.</p>
      )}
    </>
  );
}
