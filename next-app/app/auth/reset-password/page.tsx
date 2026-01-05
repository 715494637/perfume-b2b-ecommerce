'use client'

import { useState, Suspense, use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { resetPassword } from '@/actions/auth'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassInput } from '@/components/ui/GlassInput'
import { GlassButton } from '@/components/ui/GlassButton'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">无效的重置链接</h1>
            <p className="text-gray-600 mb-4">重置链接已过期或无效</p>
            <GlassButton
              onClick={() => router.push('/auth/forgot-password')}
              className="w-full"
            >
              重新申请重置密码
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      setError('密码至少需要 8 个字符，包含大小写字母和数字')
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
      setError(result.error || '重置密码失败')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">密码重置成功</h1>
            <p className="text-gray-600 mb-4">请使用新密码登录</p>
            <p className="text-sm text-gray-500">正在跳转到登录页面...</p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">重置密码</h1>
          <p className="text-gray-600">请输入您的新密码</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              新密码
            </label>
            <GlassInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 8 个字符，包含大小写字母和数字"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              确认新密码
            </label>
            <GlassInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入新密码"
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">加载中...</p>
          </div>
        </GlassCard>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}