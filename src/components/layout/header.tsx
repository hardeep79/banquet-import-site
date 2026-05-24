"use client";

import * as React from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/catalog", label: "Catalog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-canvas)]/85 backdrop-blur border-b border-[var(--color-state-line)]">
      <Container className="flex items-center justify-between h-20">
        <Link href="/" className="font-[var(--font-display)] text-xl tracking-tight">
          {brand.name}
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wide text-[var(--color-ink-primary)] hover:text-[var(--color-brand-gold)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/quote">{brand.ctaPrimary}</Link>
          </Button>
        </nav>
        <button
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[var(--color-ink-primary)]"
        >
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current mb-1.5" />
          <span className="block w-6 h-px bg-current" />
        </button>
      </Container>
      {open && (
        <Container className="md:hidden pb-6 flex flex-col gap-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="text-sm uppercase text-[var(--color-brand-gold)]"
          >
            {brand.ctaPrimary}
          </Link>
        </Container>
      )}
    </header>
  );
}
