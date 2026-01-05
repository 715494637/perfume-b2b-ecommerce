"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, label, error, helperText, id, value, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(Boolean(value))
    const inputId = React.useId()
    const finalId = id || inputId

    return (
      <div className="block w-full">
        {label && (
          <label
            htmlFor={finalId}
            className="block text-xs font-medium text-white/70 leading-[1.4] tracking-[0.02em] uppercase mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <motion.input
            type={type}
            id={finalId}
            className={cn(
              "flex h-13 w-full rounded-2xl border bg-white/5 px-6 py-[14px] text-[0.9375rem] text-white backdrop-blur-md transition-all duration-300",
              "border-white/20 placeholder:text-white/40",
              "hover:bg-white/8 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
              "focus-visible:outline-none focus-visible:bg-white/10 focus-visible:border-white/50 focus-visible:shadow-[0_0_30px_rgba(255,255,255,0.15)]",
              "disabled:cursor-not-allowed disabled:bg-white/3 disabled:border-white/10 disabled:opacity-50",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              error && "border-red-400/50 bg-red-500/10 focus-visible:border-red-400/50 focus-visible:shadow-[0_0_20px_rgba(239,68,68,0.1)]",
              className
            )}
            ref={ref}
            value={value}
            onFocus={(e) => {
              setFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              setHasValue(Boolean(e.target.value))
              props.onBlur?.(e)
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value))
              props.onChange?.(e)
            }}
            {...props}
          />

          {/* 聚焦发光效果 */}
          <AnimatePresence>
            {focused && !error && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/10 blur-xl -z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.03 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* 错误提示 */}
        {error && (
          <motion.p
            className="flex items-center gap-2 text-[0.8125rem] font-medium text-red-400 leading-[1.4] mt-1.5"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.p>
        )}

        {/* 帮助文本 */}
        {helperText && !error && (
          <motion.p
            className="text-[0.8125rem] text-gray-400 leading-[1.5] tracking-[0.01em] mt-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    )
  }
)
GlassInput.displayName = "GlassInput"

export { GlassInput }