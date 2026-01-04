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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#1a2f23]">
      {/* 背景装饰 - 模拟绿叶光影背景 */}
      <div className="absolute inset-0 z-0">
        {/* 深色基底 */}
        <div className="absolute inset-0 bg-[#0d261d]" />
        
        {/* 大型模糊光斑 - 模拟阳光透过树叶 */}
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-[#2b8259] opacity-40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-[#3ba370] opacity-30 blur-[100px]" />
        
        {/* 明亮的嫩绿高光 - 模拟高光 */}
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#9ad822] opacity-20 blur-[80px]" />
        <div className="absolute bottom-[30%] left-[5%] w-[300px] h-[300px] rounded-full bg-[#7eb812] opacity-15 blur-[60px]" />
        
        {/* 纹理覆盖（可选，增加质感） */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
      
      <GlassCard className="w-full max-w-lg p-12 relative z-10 border-white/20 shadow-2xl backdrop-blur-[60px] bg-white/10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white mb-4 tracking-wide">Welcome Back</h1>
          <p className="text-gray-200 text-lg font-light tracking-wide">Find your perfect space</p>
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