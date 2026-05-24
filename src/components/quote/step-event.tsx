"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { QuoteFormState } from "./types";
import { PROVINCES } from "./types";

interface Props {
  value: QuoteFormState;
  onChange: (patch: Partial<QuoteFormState>) => void;
}

export function StepEvent({ value, onChange }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Field label="Event type">
        <Select
          value={value.eventType}
          onChange={(e) => onChange({ eventType: e.target.value as QuoteFormState["eventType"] })}
        >
          <option value="">Select…</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate</option>
          <option value="gala">Gala</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field label="Event date (or TBD)">
        <Input
          type="text"
          placeholder="YYYY-MM-DD or TBD"
          value={value.eventDate}
          onChange={(e) => onChange({ eventDate: e.target.value })}
        />
      </Field>
      <Field label="Headcount">
        <Input
          type="number"
          min={1}
          value={value.headcount === "" ? "" : String(value.headcount)}
          onChange={(e) =>
            onChange({ headcount: e.target.value === "" ? "" : Number(e.target.value) })
          }
        />
      </Field>
      <Field label="Delivery city">
        <Input value={value.city} onChange={(e) => onChange({ city: e.target.value })} />
      </Field>
      <Field label="Province">
        <Select value={value.province} onChange={(e) => onChange({ province: e.target.value })}>
          <option value="">Select…</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
