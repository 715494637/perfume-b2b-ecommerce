"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "light" | "dark" | "subtle"
    glow?: boolean
    tilt?: boolean
    hover?: boolean
  }
>(({ className, variant = "dark", glow = true, tilt = false, hover = false, children, ...props }, ref) => {
  const cardRef = React.useRef<HTMLDivElement>(null)

  // 3D 倾斜效果的鼠标位置追踪
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 400, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 400, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const variants = {
    light: "bg-white/10 backdrop-blur-2xl border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
    dark: "bg-black/30 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
    subtle: "bg-white/8 backdrop-blur-xl border-white/15 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]",
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative rounded-3xl border transition-all duration-500",
        variants[variant],
        glow && "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
        tilt && "transform-gpu",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        tilt
          ? {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : undefined}
      ref={ref}
      {...props}
    >
      {/* 动态光效 - 性能优化版 */}
      {tilt && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
          style={{ willChange: 'opacity' }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at calc(50% + ${mouseX.get() * 100}%) calc(50% + ${mouseY.get() * 100}%), rgba(255,255,255,0.1) 0%, transparent 50%)`,
              opacity: Math.abs(mouseX.get()) + Math.abs(mouseY.get()) > 0 ? 0.8 : 0,
            }}
          />
        </div>
      )}

      {/* 顶部光晕 - 性能优化版 */}
      {glow && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 40%)",
          }}
        />
      )}

      {/* 内容 */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }