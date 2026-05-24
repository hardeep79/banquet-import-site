import { JsonLd } from "./json-ld";
import { brand } from "@/lib/brand";

export function OrganizationJsonLd() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-banquet.vercel.app";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brand.name,
        url: base,
        email: brand.email,
        telephone: brand.phone,
        areaServed: "CA",
        description: brand.tagline,
      }}
    />
  );
}
