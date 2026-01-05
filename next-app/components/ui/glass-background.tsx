"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * GlassBackground - 全站玻璃态背景组件
 *
 * @description 提供流动渐变动画和动态光晕效果的全站背景组件
 *
 * @example
 * ```tsx
 * <GlassBackground variant="default" animatedGradient mouseGlow>
 *   {children}
 * </GlassBackground>
 * ```
 *
 * @features
 * - 流动渐变动画（多色光晕）
 * - 动态光晕效果（鼠标跟随）
 * - 性能优化（GPU 加速、节流）
 * - 移动端适配（简化动画）
 * - 可配置变体（default/minimal/rich）
 */

// 变体配置
const backgroundVariants = {
  default: {
    overlayOpacity: 0.25,
    glowColors: ["rgba(34, 211, 238, 0.22)", "rgba(52, 211, 153, 0.18)", "rgba(251, 191, 36, 0.12)", "rgba(139, 92, 246, 0.08)"],
    animationSpeed: "slow" as const
  },
  minimal: {
    overlayOpacity: 0.5,
    glowColors: ["rgba(255, 255, 255, 0.08)"],
    animationSpeed: "very-slow" as const
  },
  rich: {
    overlayOpacity: 0.2,
    glowColors: ["rgba(34, 211, 238, 0.2)", "rgba(52, 211, 153, 0.18)", "rgba(251, 191, 36, 0.15)", "rgba(139, 92, 246, 0.1)"],
    animationSpeed: "medium" as const
  }
}

const animationSpeeds = {
  "very-slow": { duration: 20, repeat: Infinity, ease: "linear" as const },
  "slow": { duration: 12, repeat: Infinity, ease: "linear" as const },
  "medium": { duration: 8, repeat: Infinity, ease: "linear" as const }
}

export interface GlassBackgroundProps {
  /** 背景变体 */
  variant?: 'default' | 'minimal' | 'rich'
  /** 是否启用流动渐变动画 */
  animatedGradient?: boolean
  /** 是否启用鼠标跟随光晕 */
  mouseGlow?: boolean
  /** 背景图片 URL（默认使用 /background.png） */
  /** 背景遮罩透明度 (0-1) */
  overlayOpacity?: number
  /** 光晕颜色（默认使用项目强调色） */
  glowColors?: string[]
  /** 是否在移动端简化动画 */
  reduceMotionMobile?: boolean
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
}

export function GlassBackground({
  variant = 'default',
  animatedGradient = true,
  mouseGlow = true,
  overlayOpacity,
  glowColors,
  reduceMotionMobile = true,
  className,
  children
}: GlassBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // 移动端检测 - 使用客户端状态避免 hydration 不匹配
  const [isMobile, setIsMobile] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    setIsMobile(window.innerWidth < 768)
  }, [])

  // 获取配置
  const config = backgroundVariants[variant]
  const shouldReduceMotion = reduceMotionMobile && isMobile
  const enableMouseGlow = mouseGlow && !isMobile
  const enableAnimatedGradient = animatedGradient && !shouldReduceMotion

  // 使用自定义遮罩透明度或变体默认值
  const finalOverlayOpacity = overlayOpacity ?? config.overlayOpacity
  const finalGlowColors = glowColors ?? config.glowColors

  // 鼠标跟随光晕
  const glowX = useSpring(mouseX, { stiffness: 150, damping: 25 })
  const glowY = useSpring(mouseY, { stiffness: 150, damping: 25 })

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableMouseGlow) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    mouseX.set(x)
    mouseY.set(y)
  }, [enableMouseGlow, mouseX, mouseY])

  // 鼠标离开时重置光晕位置
  const handleMouseLeave = React.useCallback(() => {
    if (!enableMouseGlow) return
    mouseX.set(0)
    mouseY.set(0)
  }, [enableMouseGlow, mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className={cn("relative min-h-screen overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 背景图片 */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      />

      {/* 光晕层 - 始终渲染以避免 hydration 不匹配 */}
      <div className="absolute inset-0 z-0">
        {/* 流动渐变动画层 */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${finalGlowColors.join(', ')})`,
            backgroundSize: '400% 400%',
            display: isMounted && enableAnimatedGradient ? 'block' : 'none'
          }}
          animate={
            isMounted && enableAnimatedGradient
              ? { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }
              : undefined
          }
          transition={animationSpeeds[config.animationSpeed]}
        />

        {/* 静态光晕层 */}
        <div
          className="absolute inset-0"
          style={{ display: !isMounted || !enableAnimatedGradient ? 'block' : 'none' }}
        >
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at top left, ${finalGlowColors[0]} 0%, transparent 50%)`
          }} />
          {finalGlowColors[1] && (
            <div className="absolute inset-0" style={{
              background: `radial-gradient(ellipse at bottom right, ${finalGlowColors[1]} 0%, transparent 50%)`
            }} />
          )}
        </div>
      </div>

      {/* 鼠标跟随光晕 - 使用 display 控制避免条件渲染引起的不匹配 */}
      <motion.div
        className="absolute z-0 rounded-full blur-3xl pointer-events-none"
        style={{
          x: glowX,
          y: glowY,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${finalGlowColors[0]} 0%, transparent 70%)`,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
          display: isMounted && enableMouseGlow ? 'block' : 'none'
        }}
      />

      {/* 半透明遮罩 */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${finalOverlayOpacity})` }}
      />

      {/* 内容层 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default GlassBackground