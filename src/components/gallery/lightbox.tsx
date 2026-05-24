"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";

interface LightboxItem {
  _id: string;
  title?: string;
  image: unknown;
}

interface LightboxProps {
  item: LightboxItem | null;
  onClose: () => void;
}

export function Lightbox({ item, onClose }: LightboxProps) {
  React.useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;
  const src = urlFor(item.image)?.width(1600).url();
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-[var(--color-bg-canvas)]/95 backdrop-blur flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-6 right-6 text-[var(--color-ink-primary)] text-3xl"
      >
        ×
      </button>
      {src && (
        <div
          className="relative w-full max-w-5xl aspect-[4/3]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={src}
            alt={item.title ?? ""}
            fill
            sizes="80vw"
            className="object-contain"
          />
          <div className="mt-6 flex items-center justify-between">
            {item.title && (
              <p className="text-sm text-[var(--color-ink-muted)]">{item.title}</p>
            )}
            <Link
              href={`/quote?notes=${encodeURIComponent(`Inspired by gallery: ${item.title ?? "(untitled)"}`)}`}
              className="text-xs uppercase tracking-wide text-[var(--color-brand-gold)]"
              onClick={onClose}
            >
              Request similar setup →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
