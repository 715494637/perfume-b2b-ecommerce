'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth/jwt'
import { Profile } from '@/types/auth'
import { getCurrentUserProfile } from '@/actions/auth'

interface AuthContextType {
  user: { userId: string; email: string } | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ userId: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        if (currentUser) {
          await fetchProfile(currentUser.userId)
        }
      } catch (error) {
        console.error('获取会话失败:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const profile = await getCurrentUserProfile()
      setProfile(profile)
    } catch (error) {
      console.error('获取用户资料失败:', error)
    }
  }

  const signOut = async () => {
    // 调用服务端登出
    const response = await fetch('/api/auth/signout', { method: 'POST' })
    if (response.ok) {
      window.location.href = '/auth/login'
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.userId)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}