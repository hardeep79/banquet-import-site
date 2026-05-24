import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MasonryGrid } from "@/components/gallery/masonry-grid";
import { getGalleryItems } from "@/lib/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Inspiration Gallery",
  description:
    "Luxury banquet and wedding setups our pieces have shaped — across ballrooms, gardens, and corporate venues.",
};

interface GalleryItem {
  _id: string;
  title?: string;
  image: unknown;
  tags?: string[];
}

export default async function GalleryPage() {
  const items = (await getGalleryItems()) as GalleryItem[];
  return (
    <>
      <section className="pt-24 pb-12">
        <Container narrow>
          <Eyebrow>Inspiration</Eyebrow>
          <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-6xl">
            Rooms we&apos;ve helped shape.
          </h1>
          <p className="mt-6 text-[var(--color-ink-muted)] text-lg">
            Tap any image for a closer look — or to start a quote inspired by what you see.
          </p>
        </Container>
      </section>
      <section className="pb-32">
        <Container>
          <MasonryGrid items={items} />
        </Container>
      </section>
    </>
  );
}
