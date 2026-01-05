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
      <div className="space-y-2">
        {label && (
          <motion.label
            htmlFor={finalId}
            className="text-sm font-medium text-gray-200 block"
            animate={{
              scale: focused || hasValue ? 0.95 : 1,
              opacity: focused || hasValue ? 0.8 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          <motion.input
            type={type}
            id={finalId}
            className={cn(
              "flex h-11 w-full rounded-full border bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              "border-white/20",
              focused && "border-white/40 bg-white/10 focus-visible:bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
              error && "border-red-400/50 bg-red-500/10 focus-visible:ring-red-400/20",
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
                className="absolute inset-0 rounded-full bg-white/10 blur-lg -z-10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-sm text-red-400 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 帮助文本 */}
        {helperText && !error && (
          <motion.p
            className="text-xs text-gray-400"
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