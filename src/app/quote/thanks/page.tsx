import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thanks — your request is in",
  description: "We received your quote request and will reply within 24 hours.",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <Container narrow className="py-32 text-center">
      <Eyebrow>Received</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-5xl">Thanks — your request is in.</h1>
      <p className="mt-6 text-[var(--color-ink-muted)] text-lg">
        A member of our team will review the details and reply within 24 hours.
      </p>
      <div className="mt-12 flex justify-center gap-4">
        <Button asChild size="lg" variant="ghost">
          <Link href="/gallery">Browse the gallery</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Container>
  );
}
