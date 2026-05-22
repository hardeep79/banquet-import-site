import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", type: "string", description: "One-line lead for category page" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", media: "heroImage" } },
});
