'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassAlert } from '@/components/ui/glass-alert'
import { GlassAuthBackground } from '@/components/ui/glass-auth-background'
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
  loading = false
}: AuthLayoutProps) {
  const router = useRouter()

  return (
    <GlassAuthBackground>
      <GlassCard className="w-full max-w-[800px] mx-auto p-6 sm:p-8 md:p-10 lg:p-12 border-white/20 rounded-[32px]" tilt>
          {/* Header */}
          <motion.div
            className="text-center space-y-2 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-[2rem] sm:text-[2.125rem] md:text-[2.25rem] font-serif font-semibold text-white leading-[1.2] tracking-[0.02em] drop-shadow-xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base font-light text-white/90 leading-[1.6] tracking-[0.01em] drop-shadow-md">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {successMessage && (
              <GlassAlert variant="success" className="mb-6">
                {successMessage}
              </GlassAlert>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {errorMessage && (
              <GlassAlert variant="error" className="mb-6">
                {errorMessage}
              </GlassAlert>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {warningMessage && (
              <GlassAlert variant="warning" className="mb-6">
                {warningMessage}
              </GlassAlert>
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
                className="text-sm text-white/95 hover:text-white transition-colors underline-offset-4 hover:underline drop-shadow-sm"
              >
                Back to Login
              </button>
            </div>
          )}
        </GlassCard>
    </GlassAuthBackground>
  )
}

export default AuthLayout