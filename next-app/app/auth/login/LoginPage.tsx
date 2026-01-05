'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn } from '@/actions/auth'
import { GlassCard as NewGlassCard } from '@/components/ui/glass-card'
import { GlassButton as NewGlassButton } from '@/components/ui/glass-button'
import { GlassInput as NewGlassInput } from '@/components/ui/glass-input'
import { GlassSpinner } from '@/components/ui/glass-spinner'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { resendVerificationEmail } from '@/actions/auth'

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [requireVerification, setRequireVerification] = useState(false)
  const [resending, setResending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const redirectTo = searchParams.get('redirectTo') || '/'
  const verified = searchParams.get('verified')
  const reset = searchParams.get('reset')

  useEffect(() => {
    // 显示验证成功的消息
    if (verified === 'true') {
      setSuccessMessage('Email verified successfully. Please sign in.')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
    if (reset === 'true') {
      setSuccessMessage('Password reset successful. Please sign in with your new password.')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }, [verified, reset])

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)
    setRequireVerification(false)

    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('redirectTo', redirectTo)

    const result = await signIn(formData)

    if (result.success) {
      // 登录成功，重定向到目标页面
      router.push(redirectTo)
      router.refresh()
    } else {
      if (result.requireVerification) {
        setRequireVerification(true)
        setError(result.error || 'Please verify your email address first')
      } else {
        setError(result.error || 'Sign in failed. Please try again.')
      }
    }

    setLoading(false)
  }

  const handleResendVerification = async () => {
    const email = errors.email?.message ? '' : searchParams.get('email') || ''
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setResending(true)
    const result = await resendVerificationEmail(email)

    if (result.success) {
      setSuccessMessage('Verification email sent. Please check your inbox.')
      setRequireVerification(false)
    } else {
      setError(result.error || 'Failed to send email. Please try again.')
    }

    setResending(false)
  }

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
        <NewGlassCard
          className="w-full max-w-[480px] p-6 border-white/20"
          tilt
        >
          {/* Header */}
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">Welcome Back</h1>
            <p className="text-gray-200 text-sm font-light tracking-wide opacity-80">Sign in to your account</p>
          </motion.div>

          {/* Success Message */}
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

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-3 rounded-lg text-sm ${
                  requireVerification
                    ? 'bg-yellow-100/90 border border-yellow-400/50 text-yellow-700'
                    : 'bg-red-100/90 border border-red-400/50 text-red-700'
                }`}
              >
                {error}
                {requireVerification && (
                  <motion.button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="ml-2 underline hover:no-underline font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {resending ? 'Sending...' : 'Resend'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NewGlassInput
                type="email"
                label="Email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                error={errors.email?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NewGlassInput
                type="password"
                label="Password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                error={errors.password?.message}
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-between pt-1 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('remember')}
                  className="mr-2 w-4 h-4 rounded border-white/30 bg-white/10 text-white focus:ring-offset-0 focus:ring-1 focus:ring-white/50"
                />
                <span className="text-sm text-gray-200 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-200 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <NewGlassButton
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </NewGlassButton>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            className="mt-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-300 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-white font-medium hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </NewGlassCard>
      </motion.div>
    </div>
  )
}