"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-white backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-white/10 border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-white/20 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] active:bg-white/15 active:border-white/25 active:shadow-[0_2px_10px_rgba(0,0,0,0.3)] active:duration-200",
        destructive: "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50",
        outline: "border border-white/30 bg-transparent hover:bg-white/10 hover:text-white hover:border-white/40",
        secondary: "bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 rounded-2xl px-8 text-[0.9375rem] font-medium",
        sm: "h-11 rounded-2xl px-6 text-sm font-medium",
        lg: "h-13 rounded-2xl px-10 text-base font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <div>
        <Comp
          className={cn(glassButtonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {/* 涟漪效果背景 */}
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* 加载状态 */}
          {loading && (
            <motion.div
              className="mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </motion.div>
          )}

          {!loading && children}
        </Comp>
      </div>
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }