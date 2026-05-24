"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Turnstile } from "@/components/quote/turnstile";

export function ContactForm() {
  const router = useRouter();
  const [state, setState] = React.useState({
    name: "",
    email: "",
    message: "",
    consent: false,
    honeypot: "",
  });
  const [token, setToken] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "contact", ...state, turnstileToken: token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      router.push("/quote/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">
          Name
        </span>
        <Input required value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} />
      </label>
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">
          Email
        </span>
        <Input
          type="email"
          required
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
        />
      </label>
      <label className="block">
        <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">
          Message
        </span>
        <Textarea
          required
          value={state.message}
          onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-[var(--color-ink-muted)]">
        <Checkbox
          required
          checked={state.consent}
          onChange={(e) => setState((s) => ({ ...s, consent: e.target.checked }))}
        />
        <span>I agree to be contacted by Maison Banquet Co.</span>
      </label>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        value={state.honeypot}
        onChange={(e) => setState((s) => ({ ...s, honeypot: e.target.value }))}
      />
      <Turnstile onVerify={setToken} />
      {error && <p className="text-sm text-red-400">Submission error: {error}</p>}
      <Button size="lg" disabled={submitting || !token || !state.consent}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
