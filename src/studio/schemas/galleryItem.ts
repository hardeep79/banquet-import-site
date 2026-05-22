import { defineField, defineType } from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title", media: "image" } },
});
