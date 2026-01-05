import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// 玻璃态基础样式
const glassVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        light: "bg-white/5 backdrop-blur-xl border-white/20",
        dark: "bg-black/20 backdrop-blur-xl border-white/10",
        subtle: "bg-white/3 backdrop-blur-lg border-white/15",
      },
      glow: {
        true: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "light",
      glow: true,
    },
  }
)

export interface GlassProps extends VariantProps<typeof glassVariants> {
  className?: string
  children: React.ReactNode
}

export function Glass({ className, variant, glow, children }: GlassProps) {
  return (
    <div className={cn(glassVariants({ variant, glow }), className)}>
      {children}
    </div>
  )
}