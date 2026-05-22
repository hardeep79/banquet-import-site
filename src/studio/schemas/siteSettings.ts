import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "serviceAreaCopy", type: "string", initialValue: "Shipping across Canada" }),
    defineField({ name: "legalAddress", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "socialHandles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", type: "string" },
            { name: "url", type: "url" },
          ],
        },
      ],
    }),
    defineField({ name: "defaultOgImage", type: "image" }),
    defineField({ name: "headerCtaLabel", type: "string", initialValue: "Request a Quote" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
