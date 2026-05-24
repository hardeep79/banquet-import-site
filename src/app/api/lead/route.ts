import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LeadSchema } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";
import { verifyTurnstile } from "@/lib/leads/turnstile";
import { leadRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!leadRateLimiter.check(ip)) {
    return NextResponse.json({ error: "rate-limited" }, { status: 429 });
  }

  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!ok) {
    return NextResponse.json({ error: "turnstile-failed" }, { status: 400 });
  }

  await submitLead(parsed.data, {
    ipCountry: req.headers.get("x-vercel-ip-country") ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
