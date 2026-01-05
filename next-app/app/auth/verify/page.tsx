'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmail } from '@/actions/auth'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GlassSpinner } from '@/components/ui/glass-spinner'

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
        setTimeout(() => {
          router.replace('/auth/login?verified=true')
        }, 2000)
      } else {
        router.replace(`/auth/login?error=${encodeURIComponent(result.error || 'Verification failed')}`)
      }
    }

    verify()
  }, [token, router])

  return (
    <AuthLayout
      title="Verifying Email"
      subtitle="Please wait while we verify your email"
      loading
    >
      <div className="flex items-center justify-center py-4">
        <GlassSpinner size="lg" variant="glass" />
      </div>
    </AuthLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background.png')" }}
        />
        <div className="absolute inset-0 z-0 bg-black/30" />
        <div className="relative z-10">
          <GlassSpinner size="lg" variant="glass" />
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}