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
        <NewGlassCard
          className="w-full max-w-[640px] sm:max-w-[560px] md:max-w-[640px] p-6 sm:p-8 md:p-10 lg:p-12 border-white/20 rounded-[32px]"
          tilt
        >
          {/* 品牌Logo区域 */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 mb-6 mx-auto rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 15 }}
          >
            <span className="text-3xl font-serif font-semibold text-white tracking-wider">L</span>
          </motion.div>

          {/* Header */}
          <motion.div
            className="text-center space-y-2 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-[2rem] sm:text-[2.125rem] md:text-[2.25rem] font-serif font-semibold text-white leading-[1.2] tracking-[0.02em]">
              Welcome Back
            </h1>
            <p className="text-base font-light text-white/80 leading-[1.6] tracking-[0.01em]">
              Sign in to your account
            </p>
          </motion.div>

          {/* Success Message */}
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

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-2xl text-sm backdrop-blur-md ${
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
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
              className="flex flex-col gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input
                  type="checkbox"
                  {...register('remember')}
                  className="w-5 h-5 rounded-lg border-white/30 bg-white/10 text-white focus:ring-offset-0 focus:ring-2 focus:ring-white/50 transition-all duration-200"
                />
                <span className="text-sm text-gray-200 group-hover:text-white transition-colors duration-200">
                  Remember me
                </span>
              </label>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-200 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-[0.875rem] text-gray-300">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-white font-medium hover:underline underline-offset-4 transition-colors duration-200"
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