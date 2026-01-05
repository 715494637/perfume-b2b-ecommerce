'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestPasswordReset } from '@/actions/auth'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassButton } from '@/components/ui/glass-button'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await requestPasswordReset(email)

    setLoading(false)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || 'Failed to send reset email. Please try again.')
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Email Sent"
        subtitle="Check your inbox for password reset instructions"
        footer={
          <GlassButton
            onClick={() => router.push('/auth/login')}
            className="w-full"
            size="lg"
          >
            Back to Login
          </GlassButton>
        }
      >
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="mx-auto w-16 h-16 bg-green-100/90 rounded-full flex items-center justify-center mb-4 animate-glow"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <p className="text-gray-200 text-sm">
            If the email is registered, you will receive a password reset email
          </p>
          <p className="text-gray-300 text-xs mt-2">
            Please check your inbox (including spam folder)
          </p>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to reset your password"
      errorMessage={error}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassInput
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassButton
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </GlassButton>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-sm text-gray-200 hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Back to Login
          </button>
        </motion.div>
      </form>
    </AuthLayout>
  )
}