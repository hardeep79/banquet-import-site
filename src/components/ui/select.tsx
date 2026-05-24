import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-12 w-full bg-[var(--color-bg-canvas)] border border-[var(--color-state-line)] px-4 text-base",
      "text-[var(--color-ink-primary)] focus-visible:outline-none",
      "focus-visible:border-[var(--color-brand-gold)] transition-colors appearance-none",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
