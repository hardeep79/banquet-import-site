import { z } from "zod";

const baseFields = {
  name: z.string().min(1).max(200),
  email: z.email().max(200),
  consent: z.literal(true),
  honeypot: z.literal(""),
  turnstileToken: z.string().min(1).max(2000),
};

export const QuotePayloadSchema = z.object({
  source: z.literal("quote"),
  ...baseFields,
  company: z.string().min(1).max(200),
  phone: z.string().min(7).max(40),
  eventType: z.enum(["wedding", "corporate", "gala", "other"]),
  eventDate: z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.literal("TBD"),
  ]),
  headcount: z.number().int().min(1).max(100_000),
  city: z.string().min(1).max(120),
  province: z.string().min(2).max(40),
  categories: z.array(z.string().min(1)).max(20).default([]),
  products: z.array(z.string().min(1)).max(20).default([]),
  budget: z.enum(["<5k", "5-15k", "15-50k", "50k+", "not-sure"]),
  needBy: z.string().min(1).max(40),
  notes: z.string().max(2000).optional().default(""),
});

export const ContactPayloadSchema = z.object({
  source: z.literal("contact"),
  ...baseFields,
  message: z.string().min(1).max(4000),
});

export const LeadSchema = z.discriminatedUnion("source", [
  QuotePayloadSchema,
  ContactPayloadSchema,
]);

export type QuotePayload = z.infer<typeof QuotePayloadSchema>;
export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
export type LeadPayload = z.infer<typeof LeadSchema>;
