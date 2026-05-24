import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { urlFor } from "@/lib/sanity/image";

interface GalleryItem {
  _id: string;
  title?: string;
  image: unknown;
}

export function GalleryTeaser({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="py-24 border-t border-[var(--color-state-line)]">
      <Container>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <Eyebrow>Inspiration</Eyebrow>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl max-w-xl">
              Rooms our pieces have transformed.
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden md:inline text-sm uppercase tracking-wide text-[var(--color-brand-gold)]"
          >
            See all →
          </Link>
        </div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {items.slice(0, 6).map((g) => {
            const src = urlFor(g.image)?.width(600).height(800).url();
            return src ? (
              <Link
                key={g._id}
                href="/gallery"
                className="relative block aspect-[3/4] overflow-hidden"
              >
                <Image src={src} alt={g.title ?? ""} fill sizes="20vw" className="object-cover" />
              </Link>
            ) : null;
          })}
        </div>
      </Container>
    </section>
  );
}
