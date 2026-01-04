'use client'

import { Suspense } from 'react'
import ResetPasswordPage from '@/app/auth/reset-password/ResetPasswordPage'

export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  )
}