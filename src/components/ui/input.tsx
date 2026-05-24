import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full bg-transparent border border-[var(--color-state-line)] px-4 text-base",
        "text-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-muted)]",
        "focus-visible:outline-none focus-visible:border-[var(--color-brand-gold)] transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
