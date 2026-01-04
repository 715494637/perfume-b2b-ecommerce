'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import Link from 'next/link'

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const redirectTo = searchParams.get('redirectTo') || '/'

  useEffect(() => {
    // 检查是否已经登录
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push(redirectTo)
      }
    }
    checkSession()
  }, [router, redirectTo])

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
        options: {
          shouldCreateUser: false,
        },
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        router.push(redirectTo)
        router.refresh()
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">欢迎回来</h1>
          <p className="text-gray-600">请登录您的账户</p>
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

          <GlassInput
            type="password"
            label="密码"
            placeholder="请输入密码"
            {...register('password', {
              required: '请输入密码',
              minLength: {
                value: 6,
                message: '密码至少需要6个字符',
              },
            })}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('remember')}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">记住我</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              忘记密码？
            </Link>
          </div>

          <GlassButton
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? '登录中...' : '登录'}
          </GlassButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            还没有账户？{' '}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-800"
            >
              立即注册
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>

          <div className="mt-6">
            <GlassButton
              variant="outline"
              className="w-full"
              onClick={() => {
                // TODO: 实现 Google OAuth 登录
                alert('Google OAuth 登录功能即将推出')
              }}
            >
              使用 Google 账号登录
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}