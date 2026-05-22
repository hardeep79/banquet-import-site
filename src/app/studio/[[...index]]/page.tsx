"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/studio/sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
