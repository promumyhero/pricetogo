import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold shadow-xs",
        destructive:
          "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/40 dark:border-rose-900/50",
        outline:
          "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-xs",
        secondary:
          "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700",
        ghost:
          "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100",
        link: "text-zinc-900 dark:text-zinc-100 underline-offset-4 hover:underline",
        emerald:
          "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40 dark:border-emerald-900/50",
      },
      size: {
        default: "h-8.5 px-3.5 py-1.5",
        sm: "h-7.5 rounded-md px-2.5 text-xs",
        lg: "h-10 rounded-lg px-6 text-sm",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
