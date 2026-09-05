import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "font-mono uppercase tracking-widest inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 outline-none select-none cursor-pointer rounded-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-700 text-white bg-neutral-900/50",
        outline:
          "border border-neutral-700 text-white bg-neutral-900/50",
        primary:
          "border border-primary bg-transparent text-primary font-black",
        secondary:
          "border border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:text-white hover:border-neutral-600 hover:bg-neutral-800/60",
        destructive:
          "border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-black hover:border-red-500",
        ghost:
          "border border-transparent text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900/50",
        link: "text-primary underline-offset-4 hover:underline border-b border-transparent hover:border-primary",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 px-2.5 py-1 text-[10px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 py-1.5 text-xs",
        md: "h-9 px-4 py-2 text-xs",
        lg: "h-11 px-6 py-2.5 text-sm",
        xl: "h-13 px-8 py-3 text-base",
        icon: "size-9 p-0",
        "icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

