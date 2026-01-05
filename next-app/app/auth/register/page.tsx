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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <NewGlassCard
            className="w-full max-w-[480px] p-6 border-white/20"
            tilt
          >
            <motion.div
              className="text-center mb-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="mx-auto w-16 h-16 bg-green-100/90 rounded-full flex items-center justify-center mb-4 animate-glow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-serif text-white mb-2">Registration Successful</h2>
              <p className="text-gray-200 text-sm">{successMessage}</p>
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
            <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">Create Account</h1>
            <p className="text-gray-200 text-sm font-light tracking-wide opacity-80">Sign up to get started</p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-100/90 border border-red-400/50 text-red-700 rounded-lg text-sm"
              >
                {error}
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
              transition={{ delay: 0.4 }}
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
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
            className="mt-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-white font-medium hover:underline underline-offset-4"
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