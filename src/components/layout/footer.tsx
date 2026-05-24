import Link from "next/link";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/container";

const FOOTER_LINKS = [
  {
    heading: "Catalog",
    links: [
      { href: "/catalog", label: "All Categories" },
      { href: "/gallery", label: "Inspiration Gallery" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/quote", label: "Request a Quote" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--color-state-line)] py-16">
      <Container className="grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-[var(--font-display)] text-2xl">{brand.name}</p>
          <p className="mt-3 text-sm text-[var(--color-ink-muted)] max-w-xs">{brand.tagline}</p>
          <p className="mt-6 text-xs uppercase tracking-wide text-[var(--color-brand-gold)]">
            {brand.serviceArea}
          </p>
        </div>
        {FOOTER_LINKS.map((col) => (
          <div key={col.heading}>
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-4">
              {col.heading}
            </p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-[var(--color-brand-gold)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="mt-12 pt-8 border-t border-[var(--color-state-line)] flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
        <span>
          © {new Date().getFullYear()} {brand.name}
        </span>
        <a href={`mailto:${brand.email}`} className="hover:text-[var(--color-brand-gold)]">
          {brand.email}
        </a>
      </Container>
    </footer>
  );
}
