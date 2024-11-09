// src/components/ui/input.tsx
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const inputStyles = cva(
  "block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type InputProps = React.ComponentPropsWithoutRef<"input"> &
  VariantProps<typeof inputStyles>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <input
        className={clsx(inputStyles({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
