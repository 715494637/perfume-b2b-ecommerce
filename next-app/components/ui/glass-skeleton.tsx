"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassSkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  circle?: boolean
  lines?: number
  shimmer?: boolean
}

export function GlassSkeleton({
  className,
  width = "100%",
  height = "1rem",
  circle = false,
  lines = 1,
  shimmer = true,
}: GlassSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "bg-white/10 backdrop-blur-sm",
            circle && "rounded-full",
            !circle && "rounded-lg"
          )}
          style={{
            width: typeof width === "number" && !circle ? `${width}%` : width,
            height: typeof height === "number" ? `${height}px` : height,
          }}
          animate={shimmer ? {
            opacity: [0.4, 0.7, 0.4],
          } : undefined}
          transition={
            shimmer
              ? {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}

// 高级骨架屏组件 - 带卡片布局
interface GlassCardSkeletonProps {
  className?: string
  header?: boolean
  avatar?: boolean
  lines?: number
}

export function GlassCardSkeleton({
  className,
  header = true,
  avatar = true,
  lines = 3,
}: GlassCardSkeletonProps) {
  return (
    <motion.div
      className={cn("p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {header && (
        <div className="flex items-center gap-4 mb-4">
          {avatar && (
            <GlassSkeleton width={48} height={48} circle />
          )}
          <div className="flex-1 space-y-2">
            <GlassSkeleton width="60%" height={20} />
            <GlassSkeleton width="40%" height={16} />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <GlassSkeleton key={i} width="100%" height={16} />
        ))}
      </div>
    </motion.div>
  )
}