import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-700",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonStyles>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonStyles({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
