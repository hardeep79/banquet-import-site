import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "h-5 w-5 appearance-none border border-[var(--color-state-line)] cursor-pointer",
      "checked:bg-[var(--color-brand-gold)] checked:border-[var(--color-brand-gold)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]",
      className,
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
