import { describe, it, expect } from "vitest";
import { QuotePayloadSchema, ContactPayloadSchema, LeadSchema } from "@/lib/leads/schema";

const validQuote = {
  source: "quote" as const,
  name: "Jane Doe",
  company: "Northwood Banquet Hall",
  email: "jane@northwood.com",
  phone: "416-555-0100",
  eventType: "wedding",
  eventDate: "2026-09-12",
  headcount: 220,
  city: "Toronto",
  province: "ON",
  categories: ["chiavari-chairs", "linens"],
  products: [],
  budget: "15-50k",
  needBy: "2026-08-01",
  notes: "Outdoor reception. Need 220 gold chiavari + matching linens.",
  consent: true,
  honeypot: "",
  turnstileToken: "x-mock-token",
};

describe("QuotePayloadSchema", () => {
  it("accepts a complete valid payload", () => {
    const r = QuotePayloadSchema.safeParse(validQuote);
    expect(r.success).toBe(true);
  });
  it("requires consent === true", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, consent: false });
    expect(r.success).toBe(false);
  });
  it("rejects bad email", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, email: "not-an-email" });
    expect(r.success).toBe(false);
  });
  it("rejects non-empty honeypot", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, honeypot: "spam" });
    expect(r.success).toBe(false);
  });
  it("accepts headcount as positive integer", () => {
    const r = QuotePayloadSchema.safeParse({ ...validQuote, headcount: 0 });
    expect(r.success).toBe(false);
  });
});

describe("ContactPayloadSchema", () => {
  it("accepts a minimal contact form payload", () => {
    const r = ContactPayloadSchema.safeParse({
      source: "contact",
      name: "Joe",
      email: "joe@example.com",
      message: "Hi, looking to talk.",
      consent: true,
      honeypot: "",
      turnstileToken: "tok",
    });
    expect(r.success).toBe(true);
  });
  it("rejects missing message", () => {
    const r = ContactPayloadSchema.safeParse({
      source: "contact",
      name: "Joe",
      email: "joe@example.com",
      consent: true,
      honeypot: "",
      turnstileToken: "tok",
    });
    expect(r.success).toBe(false);
  });
});

describe("LeadSchema (discriminated union)", () => {
  it("parses a quote", () => {
    const r = LeadSchema.safeParse(validQuote);
    expect(r.success).toBe(true);
  });
  it("parses a contact", () => {
    const r = LeadSchema.safeParse({
      source: "contact",
      name: "Joe",
      email: "joe@example.com",
      message: "Hi",
      consent: true,
      honeypot: "",
      turnstileToken: "tok",
    });
    expect(r.success).toBe(true);
  });
});
