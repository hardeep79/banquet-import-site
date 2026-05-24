"use client";

import * as React from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { FilterChips } from "@/components/catalog/filter-chips";
import { Lightbox } from "@/components/gallery/lightbox";

interface GalleryItem {
  _id: string;
  title?: string;
  image: unknown;
  tags?: string[];
}

export function MasonryGrid({ items }: { items: GalleryItem[] }) {
  const allTags = React.useMemo(
    () => Array.from(new Set(items.flatMap((g) => g.tags ?? []))).sort(),
    [items],
  );
  const [active, setActive] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<GalleryItem | null>(null);
  const visible = active === null ? items : items.filter((g) => g.tags?.includes(active));

  return (
    <>
      {allTags.length > 0 && (
        <div className="mb-10">
          <FilterChips tags={allTags} value={active} onChange={setActive} />
        </div>
      )}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
        {visible.map((g) => {
          const src = urlFor(g.image)?.width(800).url();
          if (!src) return null;
          return (
            <button
              key={g._id}
              onClick={() => setOpen(g)}
              className="block mb-4 w-full overflow-hidden bg-[var(--color-bg-elevated)] break-inside-avoid"
            >
              <div className="relative w-full">
                <Image
                  src={src}
                  alt={g.title ?? ""}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="w-full h-auto object-cover transition-opacity hover:opacity-90"
                />
              </div>
            </button>
          );
        })}
      </div>
      <Lightbox item={open} onClose={() => setOpen(null)} />
    </>
  );
}
