"use client";

import * as React from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: unknown[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = React.useState(0);
  const main = images[active];
  const mainSrc = urlFor(main)?.width(1200).height(1200).url();
  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-square bg-[var(--color-bg-elevated)] overflow-hidden">
        {mainSrc && (
          <Image
            src={mainSrc}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {images.map((img, i) => {
            const src = urlFor(img)?.width(200).height(200).url();
            if (!src) return null;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative aspect-square overflow-hidden border-2",
                  i === active
                    ? "border-[var(--color-brand-gold)]"
                    : "border-transparent hover:border-[var(--color-state-line)]",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
