import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanity } from "./client";

const builder = imageUrlBuilder(sanity);

// Accepts `unknown` so components can pass raw Sanity fields without casting.
// Returns null for falsy/invalid inputs; otherwise an image-url builder chain.
export function urlFor(source: unknown) {
  if (!source) return null;
  return builder.image(source as SanityImageSource);
}
