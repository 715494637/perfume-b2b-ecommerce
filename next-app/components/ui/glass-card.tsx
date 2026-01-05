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
>(({ className, variant = "light", glow = true, tilt = false, hover = false, children, ...props }, ref) => {
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
    light: "bg-white/5 backdrop-blur-xl border-white/20",
    dark: "bg-black/20 backdrop-blur-xl border-white/10",
    subtle: "bg-white/3 backdrop-blur-lg border-white/15",
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
      {/* 动态光效 */}
      {tilt && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
          style={{ transform: "translateZ(1px)" }}
        >
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at calc(50% + ${mouseX.get() * 100}%) calc(50% + ${mouseY.get() * 100}%), rgba(255,255,255,0.15) 0%, transparent 60%)`,
              opacity: Math.abs(mouseX.get()) + Math.abs(mouseY.get()) > 0 ? 1 : 0,
            }}
          />
        </div>
      )}

      {/* 内容容器 */}
      <div className="relative z-10" style={{ transform: "translateZ(10px)" }}>
        {children}
      </div>

      {/* 顶部光晕 */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 50%)",
            opacity: 0.5,
          }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }