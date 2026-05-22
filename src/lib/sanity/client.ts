import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-01",
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
});
