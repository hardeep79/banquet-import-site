import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { QuoteForm } from "@/components/quote/quote-form";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us about your event. We'll come back within 24 hours with sourcing, pricing, and a delivery plan.",
};

export default function QuotePage() {
  return (
    <Container narrow className="py-24">
      <Eyebrow>Quote Request</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-5xl">Tell us about your event.</h1>
      <p className="mt-6 text-[var(--color-ink-muted)]">
        Three short steps. We reply within 24 hours.
      </p>
      <div className="mt-16">
        <Suspense fallback={null}>
          <QuoteForm />
        </Suspense>
      </div>
    </Container>
  );
}
