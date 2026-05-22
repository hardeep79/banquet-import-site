export const brand = {
  name: "Maison Banquet Co.",
  tagline: "Luxury banquet furnishings, imported with intent.",
  serviceArea: "Shipping across Canada",
  ctaPrimary: "Request a Quote",
  ctaSecondary: "View Catalog",
  email: "hello@maisonbanquet.example",
  phone: "+1 (000) 000-0000",
  isPlaceholder: true,
} as const;

export type Brand = typeof brand;
