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

export function StepOrder({ value, onChange }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Field label="Business type">
        <Select
          value={value.businessType}
          onChange={(e) => onChange({ businessType: e.target.value as QuoteFormState["businessType"] })}
        >
          <option value="">Select…</option>
          <option value="banquet-hall">Banquet hall</option>
          <option value="hotel">Hotel</option>
          <option value="restaurant">Restaurant</option>
          <option value="decorator">Decorator</option>
          <option value="rental-company">Rental company</option>
          <option value="event-planner">Event planner</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field label="Order size">
        <Select
          value={value.orderSize}
          onChange={(e) => onChange({ orderSize: e.target.value as QuoteFormState["orderSize"] })}
        >
          <option value="">Select…</option>
          <option value="sample">Sample only</option>
          <option value="1-2-cases">1–2 cases</option>
          <option value="3-10-cases">3–10 cases</option>
          <option value="11-50-cases">11–50 cases</option>
          <option value="container-load">Container load</option>
          <option value="not-sure">Not sure yet</option>
        </Select>
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
