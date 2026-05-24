import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

interface Spec {
  label: string;
  value: string;
}

interface SpecSheetProps {
  category: string;
  title: string;
  shortDescription?: string;
  specs?: Spec[];
  productSlug: string;
}

export function SpecSheet({ category, title, shortDescription, specs = [], productSlug }: SpecSheetProps) {
  return (
    <div>
      <Eyebrow>{category}</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl leading-tight">{title}</h1>
      {shortDescription && (
        <p className="mt-6 text-lg text-[var(--color-ink-muted)] leading-relaxed">{shortDescription}</p>
      )}
      {specs.length > 0 && (
        <dl className="mt-10 border-t border-[var(--color-state-line)]">
          {specs.map((s) => (
            <div
              key={s.label}
              className="flex justify-between py-4 border-b border-[var(--color-state-line)]"
            >
              <dt className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">{s.label}</dt>
              <dd className="text-sm text-[var(--color-ink-primary)]">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-10">
        <Button asChild size="lg">
          <Link href={`/quote?product=${encodeURIComponent(productSlug)}`}>Request a Quote</Link>
        </Button>
      </div>
      <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
        We reply within 24 hours with sourcing options and pricing for your volume.
      </p>
    </div>
  );
}
