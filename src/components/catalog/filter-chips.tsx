"use client";

import * as React from "react";
import { Chip } from "@/components/ui/chip";

interface FilterChipsProps {
  tags: string[];
  value: string | null;
  onChange: (tag: string | null) => void;
}

export function FilterChips({ tags, value, onChange }: FilterChipsProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <Chip selected={value === null} onClick={() => onChange(null)}>All</Chip>
      {tags.map((tag) => (
        <Chip key={tag} selected={value === tag} onClick={() => onChange(tag)}>
          {tag}
        </Chip>
      ))}
    </div>
  );
}
