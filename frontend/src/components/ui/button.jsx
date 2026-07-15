import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap",
    "rounded-md",
    "text-[13px] font-medium leading-none",
    "transition-all duration-100 ease-in-out",
    "select-none cursor-pointer",
    "border border-[#d4d4d4] dark:border-[#383838]",
    "bg-[#f5f5f5] dark:bg-[#1c1c1c]",
    "text-[#1a1a1a] dark:text-[#e0e0e0]",
    "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
    "hover:bg-[#ebebeb] dark:hover:bg-[#262626]",
    "hover:border-[#c0c0c0] dark:hover:border-[#484848]",
    "active:bg-[#e0e0e0] dark:active:bg-[#2c2c2c]",
    "active:shadow-none",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#a0a0a0] dark:focus-visible:ring-[#555]",
    "focus-visible:ring-offset-1",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "[&_svg]:size-3.5",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 hover:border-red-300 dark:hover:border-red-800",
        outline: "",
        secondary: "",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-[#f0f0f0] dark:hover:bg-[#1c1c1c] hover:border-transparent",
        link:
          "border-transparent bg-transparent shadow-none underline-offset-4 hover:underline hover:bg-transparent hover:border-transparent",
      },

      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-11 px-6 py-3",
        icon: "size-10 p-0",
        "icon-sm": "size-9 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };