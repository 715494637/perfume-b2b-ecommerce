"use client"

import { cn } from "@/lib/utils"

/**
 * GlassAuthBackground - 零性能问题静态背景
 *
 * @performance-optimizations
 * - 完全移除动态渲染：使用静态背景图片
 * - 零GPU负担：无动画、无渐变、无模糊
 * - 极致性能：图片缓存 + 静态显示
 *
 * @design-approach
 * - 使用 background.png 作为背景
 * - 保持玻璃态卡片的美观对比
 * - 响应式图片适配
 */

export interface GlassAuthBackgroundProps {
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
}

export function GlassAuthBackground({
  className,
  children
}: GlassAuthBackgroundProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center pl-8 pr-6 sm:pl-12 sm:pr-8 md:pl-16 md:pr-10 lg:pl-20 lg:pr-12 xl:pl-24 xl:pr-16 relative overflow-hidden", className)}>
      {/* 静态背景图片 - 零性能负担 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      {/* 内容层 */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  )
}

export default GlassAuthBackground