import { Container } from "@/components/ui/container";
import { getLegalPage } from "@/lib/sanity/queries";

export const revalidate = 300;

export default async function PrivacyPage() {
  const doc = await getLegalPage("privacy");
  return (
    <Container narrow className="py-24">
      <h1 className="font-[var(--font-display)] text-5xl mb-8">
        {doc?.title ?? "Privacy Policy"}
      </h1>
      <article className="prose prose-invert">
        {doc?.body ? (
          <p>Rendered via PortableText in a later task once seed content exists.</p>
        ) : (
          <p className="text-[var(--color-ink-muted)]">
            Placeholder privacy policy. Real copy lands before promotion to live.
          </p>
        )}
      </article>
    </Container>
  );
}
