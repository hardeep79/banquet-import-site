import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

interface SanityWebhookBody {
  _type?: string;
  slug?: { current?: string };
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as SanityWebhookBody;
  const type = body._type;
  const slug = body.slug?.current;

  const tags: string[] = [];
  switch (type) {
    case "category":
      tags.push("categories");
      if (slug) tags.push(`category:${slug}`);
      break;
    case "product":
      tags.push("featured");
      if (slug) tags.push(`product:${slug}`);
      break;
    case "galleryItem":
      tags.push("gallery");
      break;
    case "siteSettings":
      tags.push("siteSettings");
      break;
    case "legalPage":
      if (slug) tags.push(`legal:${slug}`);
      break;
    default:
      // unknown — revalidate everything cheap
      tags.push("categories", "featured", "gallery", "siteSettings");
  }

  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: tags });
}
