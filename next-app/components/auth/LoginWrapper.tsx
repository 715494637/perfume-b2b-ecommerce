'use client'

import { Suspense } from 'react'
import LoginPage from '@/app/auth/login/LoginPage'

export default function LoginWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  )
}