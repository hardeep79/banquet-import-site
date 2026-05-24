"use client";

import * as React from "react";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { QuoteFormState } from "./types";
import { CATEGORIES } from "./types";

interface Props {
  value: QuoteFormState;
  onChange: (patch: Partial<QuoteFormState>) => void;
}

export function StepProduct({ value, onChange }: Props) {
  function toggleCategory(slug: string) {
    onChange({
      categories: value.categories.includes(slug)
        ? value.categories.filter((c) => c !== slug)
        : [...value.categories, slug],
    });
  }
  return (
    <div className="space-y-8">
      <div>
        <p className="block text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-3">
          Categories needed
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.slug}
              selected={value.categories.includes(c.slug)}
              onClick={() => toggleCategory(c.slug)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>
      <Field label="Budget">
        <Select
          value={value.budget}
          onChange={(e) => onChange({ budget: e.target.value as QuoteFormState["budget"] })}
        >
          <option value="">Select…</option>
          <option value="<5k">Less than $5k</option>
          <option value="5-15k">$5–15k</option>
          <option value="15-50k">$15–50k</option>
          <option value="50k+">$50k+</option>
          <option value="not-sure">Not sure yet</option>
        </Select>
      </Field>
      <Field label="Need-by date (or 'Flexible')">
        <Input value={value.needBy} onChange={(e) => onChange({ needBy: e.target.value })} />
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
