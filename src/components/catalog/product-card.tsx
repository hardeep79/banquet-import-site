import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  images?: unknown[];
  category: { title: string; slug: string };
}

export function ProductCard({ product }: { product: Product }) {
  const first = product.images?.[0];
  const src = urlFor(first)?.width(700).height(700).url();
  return (
    <Link href={`/catalog/${product.category.slug}/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-elevated)]">
        {src && (
          <Image
            src={src}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
          {product.category.title}
        </p>
        <h3 className="mt-1 text-lg group-hover:text-[var(--color-brand-gold)] transition-colors">
          {product.title}
        </h3>
        <div className="mt-2 h-px w-6 bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-12" />
      </div>
    </Link>
  );
}
