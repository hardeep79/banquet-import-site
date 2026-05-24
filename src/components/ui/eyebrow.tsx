import * as React from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs uppercase font-medium text-[var(--color-brand-gold)]",
        "tracking-[var(--tracking-eyebrow)]",
        className,
      )}
      {...props}
    />
  );
}
