import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-24 w-full bg-transparent border border-[var(--color-state-line)] px-4 py-3 text-base",
      "text-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-muted)]",
      "focus-visible:outline-none focus-visible:border-[var(--color-brand-gold)] transition-colors",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
