'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signUp } from '@/actions/auth'
import { GlassCard as NewGlassCard } from '@/components/ui/glass-card'
import { GlassButton as NewGlassButton } from '@/components/ui/glass-button'
import { GlassInput as NewGlassInput } from '@/components/ui/glass-input'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface RegisterFormData {
  displayName: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('displayName', data.displayName)

      const result = await signUp(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setSuccessMessage(result.message || 'Registration successful! Please check your email and click the verification link')
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
            <motion.div
              className="text-center space-y-2 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="mx-auto w-16 h-16 bg-green-100/90 rounded-full flex items-center justify-center mb-6 animate-glow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-[2rem] sm:text-[2.125rem] md:text-[2.25rem] font-serif font-semibold text-white leading-[1.2] tracking-[0.02em]">
                Registration Successful
              </h2>
              <p className="text-base font-light text-white/80 leading-[1.6] tracking-[0.01em]">
                {successMessage}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NewGlassButton
                onClick={() => router.push('/auth/login')}
                className="w-full"
                size="lg"
              >
                Go to Login
              </NewGlassButton>
            </motion.div>
          </NewGlassCard>
        </motion.div>
      </div>
    )
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
              Create Account
            </h1>
            <p className="text-base font-light text-white/80 leading-[1.6] tracking-[0.01em]">
              Sign up to get started
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-100/90 border border-red-400/50 text-red-700 rounded-2xl text-sm backdrop-blur-md"
              >
                {error}
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
                type="text"
                label="Display Name"
                placeholder="Enter your display name"
                {...register('displayName', {
                  required: 'Display name is required',
                  minLength: {
                    value: 2,
                    message: 'Display name must be at least 2 characters',
                  },
                })}
                error={errors.displayName?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
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
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <NewGlassInput
                type="password"
                label="Password"
                placeholder="Create a password (8+ chars, uppercase, lowercase, number)"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number',
                  },
                })}
                error={errors.password?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <NewGlassInput
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <NewGlassButton
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </NewGlassButton>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-[0.875rem] text-gray-300">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-white font-medium hover:underline underline-offset-4 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </NewGlassCard>
      </motion.div>
    </div>
  )
}