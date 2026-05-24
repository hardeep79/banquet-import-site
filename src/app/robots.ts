import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-banquet.vercel.app";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/", "/quote/thanks"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
