import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const cardStyles = cva("rounded-lg bg-white shadow-sm", {
  variants: {
    variant: {
      default: "p-6",
      elevated: "p-6 shadow-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const cardHeaderStyles = cva("flex items-center justify-between pb-4", {
  variants: {
    variant: {
      default: "",
      elevated: "border-b border-slate-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type CardProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof cardStyles>;
type CardHeaderProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof cardHeaderStyles>;
type CardTitleProps = React.ComponentPropsWithoutRef<"h3">;
type CardContentProps = React.ComponentPropsWithoutRef<"div">;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={clsx(cardStyles({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={clsx(cardHeaderStyles({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  (props, ref) => {
    return <h3 className="text-lg font-semibold" ref={ref} {...props} />;
  }
);

CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (props, ref) => {
    return <div className="space-y-4" ref={ref} {...props} />;
  }
);

CardContent.displayName = "CardContent";
