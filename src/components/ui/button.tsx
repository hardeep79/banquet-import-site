"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide " +
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[var(--color-brand-gold)] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[var(--color-bg-canvas)] disabled:opacity-50 " +
    "disabled:pointer-events-none uppercase",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-gold)] text-[var(--color-bg-canvas)] " +
          "hover:bg-[var(--color-brand-gold-soft)]",
        ghost:
          "border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] " +
          "hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-bg-canvas)]",
        link:
          "text-[var(--color-ink-primary)] underline-offset-4 " +
          "decoration-[var(--color-brand-gold)] hover:underline normal-case tracking-normal",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-12 px-7 text-sm",
        lg: "h-14 px-9 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
}

// When `asChild` is true, the Button renders as its single child (e.g. <Link>),
// merging styles onto that element instead of wrapping it in a <button>.
// This avoids invalid nested-interactive markup like <button><a>...
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(button({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
