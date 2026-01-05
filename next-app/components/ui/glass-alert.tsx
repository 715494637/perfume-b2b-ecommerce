"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// 主容器样式变体
const glassAlertVariants = cva(
  "relative overflow-hidden backdrop-blur-xl border shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        success: "bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-emerald-700/5 border-emerald-400/40 shadow-emerald-500/10",
        error: "bg-gradient-to-br from-rose-500/20 via-rose-600/10 to-rose-700/5 border-rose-400/40 shadow-rose-500/10",
        warning: "bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-700/5 border-amber-400/40 shadow-amber-500/10",
      },
      size: {
        sm: "p-3 rounded-xl gap-2",
        default: "p-4 rounded-2xl gap-3",
        lg: "p-5 rounded-3xl gap-4",
      },
    },
    defaultVariants: {
      variant: "success",
      size: "default",
    },
  }
)

// 文字颜色变体
const textVariants = cva("", {
  variants: {
    variant: {
      success: "text-emerald-50",
      error: "text-rose-50",
      warning: "text-amber-50",
    },
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "success",
    size: "default",
  },
})

// 图标尺寸变体
const iconSizeVariants = {
  sm: "w-5 h-5",
  default: "w-6 h-6",
  lg: "w-7 h-7",
}

// 光晕动画变体
const glowAnimationVariants = {
  success: "animate-glow-emerald",
  error: "animate-glow-rose",
  warning: "animate-glow-amber",
}

// 成功图标 - 精致的钻石形状勾选
const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" opacity="0.5" />
    <path d="M9 12l2.5 2.5L15 9.5" />
    <circle cx="12" cy="12" r="3" strokeWidth="0.5" opacity="0.3" />
  </svg>
)

// 错误图标 - 优雅的菱形警告
const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" opacity="0.5" />
    <path d="M12 8v4" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="3" strokeWidth="0.5" opacity="0.3" />
  </svg>
)

// 警告图标 - 奢华的星形提示
const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" opacity="0.5" />
    <path d="M12 7v6" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="3" strokeWidth="0.5" opacity="0.3" />
  </svg>
)

// 主 Alert 组件
export interface GlassAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  showIcon?: boolean
  icon?: React.ReactNode
  size?: 'sm' | 'default' | 'lg'
}

const GlassAlert = React.forwardRef<HTMLDivElement, GlassAlertProps>(
  ({
    className,
    variant = 'success',
    title,
    dismissible = false,
    onDismiss,
    showIcon = true,
    icon,
    size = 'default',
    children,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleDismiss = () => {
      setIsVisible(false)
      setTimeout(() => {
        onDismiss?.()
      }, 400) // 等待动画完成
    }

    const IconComponent = {
      success: SuccessIcon,
      error: ErrorIcon,
      warning: WarningIcon,
    }[variant]

    return (
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(glassAlertVariants({ variant, size }), className)}
            {...props}
          >
            {/* 背景光晕效果 */}
            <div className={cn(
              "absolute inset-0 opacity-30 blur-2xl pointer-events-none",
              glowAnimationVariants[variant]
            )} />

            {/* 内发光效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

            {/* 内容容器 */}
            <div className="relative flex items-start gap-3">
              {/* 图标 */}
              {showIcon && (
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center",
                  iconSizeVariants[size],
                  variant === 'success' && "animate-bounce-in",
                  variant === 'error' && "animate-shake",
                  variant === 'warning' && "animate-pulse-soft"
                )}>
                  {icon || <IconComponent />}
                </div>
              )}

              {/* 内容区域 */}
              <div className={cn("flex-1 min-w-0", textVariants({ variant, size }))}>
                {title && (
                  <GlassAlertTitle className="mb-1">{title}</GlassAlertTitle>
                )}
                <GlassAlertDescription>{children}</GlassAlertDescription>
              </div>

              {/* 关闭按钮 */}
              {dismissible && (
                <GlassAlertClose onClick={handleDismiss} size={size}>
                  <X className={iconSizeVariants[size]} />
                </GlassAlertClose>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
GlassAlert.displayName = "GlassAlert"

// 子组件
export interface GlassAlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
const GlassAlertTitle = React.forwardRef<HTMLHeadingElement, GlassAlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("font-semibold tracking-tight", className)}
      {...props}
    />
  )
)
GlassAlertTitle.displayName = "GlassAlertTitle"

export interface GlassAlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
const GlassAlertDescription = React.forwardRef<HTMLParagraphElement, GlassAlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("font-normal leading-relaxed opacity-90", className)}
      {...props}
    />
  )
)
GlassAlertDescription.displayName = "GlassAlertDescription"

export interface GlassAlertCloseProps extends React.HTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default' | 'lg'
}
const GlassAlertClose = React.forwardRef<HTMLButtonElement, GlassAlertCloseProps>(
  ({ className, size = 'default', ...props }, ref) => {
    const iconSize = iconSizeVariants[size]

    return (
      <button
        ref={ref}
        onClick={props.onClick}
        className={cn(
          "flex-shrink-0 hover:bg-white/10 rounded-md transition-colors duration-200",
          size === 'sm' && "p-1",
          size === 'default' && "p-1.5",
          size === 'lg' && "p-2",
          className
        )}
        {...props}
      >
        <X className={iconSize} />
      </button>
    )
  }
)
GlassAlertClose.displayName = "GlassAlertClose"

export { GlassAlert, GlassAlertTitle, GlassAlertDescription, GlassAlertClose, glassAlertVariants }