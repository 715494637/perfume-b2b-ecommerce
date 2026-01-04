'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import Link from 'next/link'

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      )

      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('发送重置邮件失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">邮件已发送</h2>
            <p className="text-gray-600">
              我们已向您的邮箱发送了密码重置链接，请查收邮件并按照提示操作。
            </p>
          </div>

          <GlassButton
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            返回登录
          </GlassButton>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">忘记密码</h1>
          <p className="text-gray-600">请输入您的邮箱地址，我们将发送重置链接</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput
            type="email"
            label="邮箱地址"
            placeholder="请输入邮箱地址"
            {...register('email', {
              required: '请输入邮箱地址',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '请输入有效的邮箱地址',
              },
            })}
            error={errors.email?.message}
          />

          <GlassButton
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? '发送中...' : '发送重置链接'}
          </GlassButton>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-800"
          >
            返回登录
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}