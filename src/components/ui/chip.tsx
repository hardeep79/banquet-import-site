"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center px-4 h-9 text-xs uppercase tracking-wide border transition-colors",
        selected
          ? "bg-[var(--color-brand-gold)] text-[var(--color-bg-canvas)] border-[var(--color-brand-gold)]"
          : "bg-transparent text-[var(--color-ink-primary)] border-[var(--color-state-line)] hover:border-[var(--color-brand-gold)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Chip.displayName = "Chip";
