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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 z-0 bg-black/30" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <GlassCard className="w-full max-w-[480px] p-6 border-white/20" tilt>
          {/* Header */}
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-200 text-sm font-light tracking-wide opacity-80">
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
                className="mb-4 p-3 bg-green-100/90 border border-green-400/50 text-green-700 rounded-lg text-sm"
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
                className="mb-4 p-3 bg-red-100/90 border border-red-400/50 text-red-700 rounded-lg text-sm"
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
                className="mb-4 p-3 bg-yellow-100/90 border border-yellow-400/50 text-yellow-700 rounded-lg text-sm"
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
          {footer && <div className="mt-5 text-center">{footer}</div>}

          {/* Back Button */}
          {showBackButton && !footer && (
            <div className="mt-5 text-center">
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