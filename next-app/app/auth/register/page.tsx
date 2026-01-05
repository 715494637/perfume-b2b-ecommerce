'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signUp } from '@/actions/auth'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
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
        setSuccessMessage(result.message || '注册成功！请查看邮箱并点击验证链接')
      }
    } catch (err) {
      setError('注册失败，请稍后重试')
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

        <GlassCard className="w-full max-w-[380px] p-6 relative z-10 border-white/20 shadow-2xl backdrop-blur-[60px] bg-white/5 rounded-3xl">
          <div className="text-center mb-5">
            <div className="mx-auto w-16 h-16 bg-green-100/90 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-white mb-2">Registration Successful</h2>
            <p className="text-gray-200 text-sm">{successMessage}</p>
          </div>

          <GlassButton
            onClick={() => router.push('/auth/login')}
            className="w-full rounded-full bg-white hover:bg-white/90 text-black font-medium py-2.5 text-base transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Login
          </GlassButton>
        </GlassCard>
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

      <GlassCard className="w-full max-w-[380px] p-6 relative z-10 border-white/20 shadow-2xl backdrop-blur-[60px] bg-white/5 rounded-3xl">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">Create Account</h1>
          <p className="text-gray-200 text-sm font-light tracking-wide opacity-80">Sign up to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100/90 border border-red-400/50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <GlassInput
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

          <GlassInput
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

          <GlassInput
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

          <GlassInput
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
          />

          <GlassButton
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white hover:bg-white/90 text-black font-medium py-2.5 text-base transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </GlassButton>
        </form>

        <div className="mt-5 text-center">
          <p className="text-gray-300 text-sm">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-white font-medium hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  )
}