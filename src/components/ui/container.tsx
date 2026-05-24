import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export function Container({ className, narrow, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-10",
        narrow ? "max-w-[720px]" : "max-w-[var(--container-default)]",
        className,
      )}
      {...props}
    />
  );
}
