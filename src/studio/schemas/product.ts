import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortDescription", type: "string", validation: (r) => r.max(180) }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.min(1).max(8),
    }),
    defineField({ name: "specs", type: "array", of: [{ type: "spec" }] }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "internalNotes", type: "text", description: "Private — not rendered." }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "images.0" },
  },
});
