"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "glass"
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
}

export function GlassSpinner({ className, size = "md", variant = "default" }: GlassSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "rounded-full border-current border-t-transparent",
          sizes[size],
          variant === "glass" && "bg-white/10 backdrop-blur-sm"
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

// 全屏加载组件
interface GlassFullPageSpinnerProps {
  message?: string
}

export function GlassFullPageSpinner({ message = "Loading..." }: GlassFullPageSpinnerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <GlassSpinner size="lg" variant="glass" className="mb-4 mx-auto" />
          <motion.p
            className="text-white text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}