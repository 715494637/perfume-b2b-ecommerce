'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmail } from '@/actions/auth'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      router.replace('/auth/login?error=invalid_token')
      return
    }

    async function verify() {
      const result = await verifyEmail(token)

      if (result.success) {
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          router.replace('/auth/login?verified=true')
        }, 2000)
      } else {
        router.replace(`/auth/login?error=${encodeURIComponent(result.error || '验证失败')}`)
      }
    }

    verify()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">正在验证邮箱...</h1>
          <p className="text-gray-600">请稍候</p>
        </div>
      </GlassCard>
    </div>
  )
}

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  )
}