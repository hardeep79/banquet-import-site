"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { QuoteFormState } from "./types";

interface Props {
  value: QuoteFormState;
  onChange: (patch: Partial<QuoteFormState>) => void;
}

export function StepContact({ value, onChange }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Field label="Full name">
        <Input value={value.name} onChange={(e) => onChange({ name: e.target.value })} required />
      </Field>
      <Field label="Company / venue">
        <Input value={value.company} onChange={(e) => onChange({ company: e.target.value })} required />
      </Field>
      <Field label="Email">
        <Input type="email" value={value.email} onChange={(e) => onChange({ email: e.target.value })} required />
      </Field>
      <Field label="Phone">
        <Input type="tel" value={value.phone} onChange={(e) => onChange({ phone: e.target.value })} required />
      </Field>
      <Field label="Notes" className="md:col-span-2">
        <Textarea value={value.notes} onChange={(e) => onChange({ notes: e.target.value })} />
      </Field>
      <label className="md:col-span-2 flex items-start gap-3 text-sm text-[var(--color-ink-muted)]">
        <Checkbox
          checked={value.consent}
          onChange={(e) => onChange({ consent: e.target.checked })}
          required
        />
        <span>I agree to be contacted by Maison Banquet Co. about my quote.</span>
      </label>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value.honeypot}
        onChange={(e) => onChange({ honeypot: e.target.value })}
        className="hidden"
        aria-hidden
      />
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
