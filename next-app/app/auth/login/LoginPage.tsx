'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn } from '@/actions/auth'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
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
      setError('邮箱验证成功，请登录')
      setTimeout(() => setError(null), 3000)
    }
    if (reset === 'true') {
      setError('密码重置成功，请使用新密码登录')
      setTimeout(() => setError(null), 3000)
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
        setError(result.error || '请先验证您的邮箱地址')
      } else {
        setError(result.error || '登录失败，请稍后重试')
      }
    }

    setLoading(false)
  }

  const handleResendVerification = async () => {
    const email = errors.email?.message ? '' : searchParams.get('email') || ''
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    setResending(true)
    const result = await resendVerificationEmail(email)

    if (result.success) {
      setError('验证邮件已发送，请查看邮箱')
      setRequireVerification(false)
    } else {
      setError(result.error || '发送失败，请稍后重试')
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

      <GlassCard className="w-full max-w-[380px] p-6 relative z-10 border-white/20 shadow-2xl backdrop-blur-[60px] bg-white/5 rounded-3xl">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">Welcome Back</h1>
          <p className="text-gray-200 text-sm font-light tracking-wide opacity-80">Sign in to your account</p>
        </div>

        {error && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              requireVerification
                ? 'bg-yellow-100/90 border border-yellow-400/50 text-yellow-700'
                : 'bg-red-100/90 border border-red-400/50 text-red-700'
            }`}
          >
            {error}
            {requireVerification && (
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="ml-2 underline hover:no-underline"
              >
                {resending ? '发送中...' : '重新发送'}
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex items-center justify-between pt-1">
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
          </div>

          <GlassButton
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white hover:bg-white/90 text-black font-medium py-2.5 text-base transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </GlassButton>
        </form>

        <div className="mt-5 text-center">
          <p className="text-gray-300 text-sm">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="text-white font-medium hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  )
}