import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ContactForm } from "@/components/contact/contact-form";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Maison Banquet Co. — for quote requests, supplier inquiries, and general questions.",
};

export default function ContactPage() {
  return (
    <Container narrow className="py-24">
      <Eyebrow>Contact</Eyebrow>
      <h1 className="mt-3 font-[var(--font-display)] text-5xl">Reach us.</h1>
      <p className="mt-6 text-[var(--color-ink-muted)]">
        For quote requests, please use the{" "}
        <a href="/quote" className="text-[var(--color-brand-gold)]">
          quote form
        </a>
        . For everything else, drop a note below.
      </p>
      <div className="mt-12 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <aside className="space-y-6 text-sm">
          <div>
            <p className="uppercase text-xs tracking-wide text-[var(--color-ink-muted)] mb-2">Email</p>
            <a href={`mailto:${brand.email}`} className="hover:text-[var(--color-brand-gold)]">
              {brand.email}
            </a>
          </div>
          <div>
            <p className="uppercase text-xs tracking-wide text-[var(--color-ink-muted)] mb-2">Phone</p>
            <a href={`tel:${brand.phone.replace(/\D/g, "")}`}>{brand.phone}</a>
          </div>
          <div>
            <p className="uppercase text-xs tracking-wide text-[var(--color-ink-muted)] mb-2">Service area</p>
            <p>{brand.serviceArea}</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
