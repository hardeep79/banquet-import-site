import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    label: "We source",
    body: "Direct relationships with a curated bench of Chinese manufacturers — no middle layer, no markup parade.",
  },
  {
    label: "We verify",
    body: "Every order ships through our QC routine. Materials, finish, dimensions, packaging — checked before container loading.",
  },
  {
    label: "We deliver",
    body: "Containerized freight to a Canadian warehouse, then last-mile to your venue. Built for volumes, sized to the room.",
  },
];

export function ProcessStrip() {
  return (
    <section id="process" className="py-32 border-t border-[var(--color-state-line)]">
      <Container>
        <div className="max-w-2xl mb-16">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-5xl">Importing, refined.</h2>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="border-t border-[var(--color-brand-gold)] pt-6">
                <p className="text-xs uppercase tracking-wide text-[var(--color-brand-gold)] mb-3">
                  0{i + 1} · {s.label}
                </p>
                <p className="text-base text-[var(--color-ink-primary)]/90 leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
