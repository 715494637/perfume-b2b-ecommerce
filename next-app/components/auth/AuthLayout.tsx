'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { motion, AnimatePresence } from 'framer-motion'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  showBackButton?: boolean
  backTo?: string
  successMessage?: string
  errorMessage?: string
  warningMessage?: string
  loading?: boolean
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  showBackButton = false,
  backTo = '/auth/login',
  successMessage,
  errorMessage,
  warningMessage,
  loading = false,
}: AuthLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 z-0 bg-black/30" />

      {/* 背景光晕效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <GlassCard className="w-full max-w-[640px] sm:max-w-[560px] md:max-w-[640px] p-6 sm:p-8 md:p-10 lg:p-12 border-white/20 rounded-[32px]" tilt>
          {/* Header */}
          <motion.div
            className="text-center space-y-2 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-[2rem] sm:text-[2.125rem] md:text-[2.25rem] font-serif font-semibold text-white leading-[1.2] tracking-[0.02em]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base font-light text-white/80 leading-[1.6] tracking-[0.01em]">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-100/90 border border-green-400/50 text-green-700 rounded-2xl text-sm backdrop-blur-md"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-100/90 border border-red-400/50 text-red-700 rounded-2xl text-sm backdrop-blur-md"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {warningMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-yellow-100/90 border border-yellow-400/50 text-yellow-700 rounded-2xl text-sm backdrop-blur-md"
              >
                {warningMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <>{children}</>
          )}

          {/* Footer */}
          {footer && <div className="mt-8 text-center">{footer}</div>}

          {/* Back Button */}
          {showBackButton && !footer && (
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push(backTo)}
                className="text-sm text-gray-200 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default AuthLayout