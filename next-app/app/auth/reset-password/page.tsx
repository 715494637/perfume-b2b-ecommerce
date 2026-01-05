'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { resetPassword } from '@/actions/auth'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassButton } from '@/components/ui/glass-button'
import { motion } from 'framer-motion'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle="The reset link has expired or is invalid"
        footer={
          <GlassButton
            onClick={() => router.push('/auth/forgot-password')}
            className="w-full"
            size="lg"
          >
            Request New Reset
          </GlassButton>
        }
      />
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, including uppercase, lowercase, and number')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('token', token)
    formData.append('password', password)

    const result = await resetPassword(formData)

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login?reset=true')
      }, 2000)
    } else {
      setError(result.error || 'Failed to reset password')
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Password Reset Successful"
        subtitle="Please use your new password to login"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <p className="text-gray-300 text-sm">Redirecting to login page...</p>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password"
      errorMessage={error}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassInput
            type="password"
            label="New Password"
            placeholder="At least 8 characters, including uppercase, lowercase, and number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassInput
            type="password"
            label="Confirm New Password"
            placeholder="Enter your new password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassButton
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </GlassButton>
        </motion.div>
      </form>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background.png')" }}
        />
        <div className="absolute inset-0 z-0 bg-black/30" />
        <div className="relative z-10">
          <motion.div
            className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}