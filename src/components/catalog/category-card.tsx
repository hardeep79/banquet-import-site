import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

interface Category {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  heroImage?: unknown;
}

export function CategoryCard({ category }: { category: Category }) {
  const src = urlFor(category.heroImage)?.width(800).height(1000).url();
  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="group block relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-elevated)]"
    >
      {src && (
        <Image
          src={src}
          alt={category.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-canvas)] via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-[var(--font-display)] text-2xl">{category.title}</h3>
        {category.tagline && (
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{category.tagline}</p>
        )}
        <div className="mt-3 h-px w-8 bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-16" />
      </div>
    </Link>
  );
}
