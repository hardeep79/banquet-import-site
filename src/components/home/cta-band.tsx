import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export function CtaBand() {
  return (
    <section className="py-32 border-t border-[var(--color-state-line)] bg-[var(--color-bg-elevated)]">
      <Container narrow className="text-center">
        <h2 className="font-[var(--font-display)] text-4xl md:text-6xl leading-tight">
          Get a quote in 24 hours.
        </h2>
        <p className="mt-6 text-[var(--color-ink-muted)] max-w-xl mx-auto">
          Tell us about the event. We&apos;ll come back with a tailored line sheet, sourcing options,
          and a delivery timeline you can plan against.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/quote">{brand.ctaPrimary}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
