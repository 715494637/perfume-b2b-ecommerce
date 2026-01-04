'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>()

  const password = watch('password')

  useEffect(() => {
    // 检查是否有有效的重置令牌
    const token = searchParams.get('token')
    if (!token) {
      setError('无效的重置链接')
    }
  }, [searchParams])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const token = searchParams.get('token')

      if (!token) {
        setError('无效的重置链接')
        return
      }

      const { error: resetError } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('重置密码失败，请重试')
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">密码重置成功</h2>
            <p className="text-gray-600">您的密码已成功重置，现在可以使用新密码登录了。</p>
          </div>

          <GlassButton
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            去登录
          </GlassButton>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">重置密码</h1>
          <p className="text-gray-600">请输入您的新密码</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput
            type="password"
            label="新密码"
            placeholder="请输入新密码"
            {...register('password', {
              required: '请输入新密码',
              minLength: {
                value: 6,
                message: '密码至少需要6个字符',
              },
            })}
            error={errors.password?.message}
          />

          <GlassInput
            type="password"
            label="确认新密码"
            placeholder="请再次输入新密码"
            {...register('confirmPassword', {
              required: '请确认新密码',
              validate: (value) => value === password || '两次输入的密码不一致',
            })}
            error={errors.confirmPassword?.message}
          />

          <GlassButton
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? '重置中...' : '重置密码'}
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  )
}