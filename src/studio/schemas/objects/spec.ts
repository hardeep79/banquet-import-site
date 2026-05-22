import { defineField, defineType } from "sanity";

export const spec = defineType({
  name: "spec",
  title: "Spec",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { label: "label", value: "value" },
    prepare: ({ label, value }) => ({ title: label, subtitle: value }),
  },
});
