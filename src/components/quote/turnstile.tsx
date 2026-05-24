"use client";

import * as React from "react";
import Script from "next/script";

interface TurnstileProps {
  onVerify: (token: string) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, opts: Record<string, unknown>) => string;
    };
  }
}

export function Turnstile({ onVerify }: TurnstileProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [ready, setReady] = React.useState(false);

  // Dev fallback: when no site key is configured, hand back a bypass token
  // immediately so local development can submit the form. The server still
  // enforces verification when TURNSTILE_SECRET_KEY is set.
  React.useEffect(() => {
    if (!siteKey) onVerify("dev-bypass-token");
  }, [siteKey, onVerify]);

  React.useEffect(() => {
    if (!ready || !ref.current || !siteKey || !window.turnstile) return;
    window.turnstile.render(ref.current, { sitekey: siteKey, callback: onVerify, theme: "dark" });
  }, [ready, siteKey, onVerify]);

  if (!siteKey) {
    return <p className="text-xs text-[var(--color-ink-muted)]">(Turnstile disabled in dev)</p>;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div ref={ref} />
    </>
  );
}
