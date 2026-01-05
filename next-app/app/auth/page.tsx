'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn, signUp, requestPasswordReset } from '@/actions/auth'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassAlert } from '@/components/ui/glass-alert'
import { GlassAuthBackground } from '@/components/ui/glass-auth-background'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
}

interface ForgotPasswordFormData {
  email: string
}

type AuthMode = 'login' | 'register' | 'forgot-password'
type ForgotPasswordStep = 'email' | 'sent' | 'reset'

const modeOrder: AuthMode[] = ['login', 'register', 'forgot-password']

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>(
    (searchParams.get('mode') as AuthMode) || 'login'
  )
  const [forgotStep, setForgotStep] = useState<ForgotPasswordStep>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [resetEmail, setResetEmail] = useState('')

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>()

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    watch,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>()

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordFormData>()

  const password = watch('password')

  const onLogin = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('redirectTo', '/')

    const result = await signIn(formData)

    if (result.success) {
      router.push('/')
      router.refresh()
    } else {
      setError(result.error || 'Sign in failed. Please try again.')
    }

    setLoading(false)
  }

  const onRegister = async (data: RegisterFormData) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = await signUp(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccessMessage(result.message || 'Registration successful! Please check your email')
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onForgotPassword = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    setError(null)

    const result = await requestPasswordReset(data.email)

    if (result.success) {
      setResetEmail(data.email)
      setForgotStep('sent')
      setSuccessMessage(result.message || 'Reset link sent to your email')
    } else {
      setError(result.error || 'Failed to send reset email')
    }

    setLoading(false)
  }

  const handleModeChange = (newMode: AuthMode) => {
    setError(null)
    setSuccessMessage(null)
    setMode(newMode)
    if (newMode === 'forgot-password') {
      setForgotStep('email')
    }
  }

  return (
    <GlassAuthBackground>
      <GlassCard
        className="w-full max-w-[1400px] h-[700px] flex overflow-hidden border-white/20 rounded-3xl mx-auto"
        tilt
      >
          {/* 左侧表单区域 */}
          <div className="w-[32.5%] p-12 flex flex-col h-full relative border-r border-white/10">
          {/* 品牌Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/25 backdrop-blur-md shadow-lg">
                <span className="text-2xl font-serif font-semibold text-white tracking-wider drop-shadow-lg">L</span>
              </div>
            </div>

            {/* Tab 切换 */}
            <div className="relative mb-6">
              <div className="flex p-1.5 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                <button
                  onClick={() => handleModeChange('login')}
                  className={`flex-1 relative py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    mode === 'login'
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  <span className="relative z-10">Sign In</span>
                </button>
                <button
                  onClick={() => handleModeChange('register')}
                  className={`flex-1 relative py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    mode === 'register'
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  <span className="relative z-10">Sign Up</span>
                </button>
                <button
                  onClick={() => handleModeChange('forgot-password')}
                  className={`flex-1 relative py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    mode === 'forgot-password'
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  <span className="relative z-10">Reset</span>
                </button>
              </div>
            </div>

            {/* 消息提示 */}
            {error && (
              <div className="mb-5">
                <GlassAlert variant="error">{error}</GlassAlert>
              </div>
            )}
            {successMessage && (
              <div className="mb-5">
                <GlassAlert variant="success">{successMessage}</GlassAlert>
              </div>
            )}

            {/* 表单内容 */}
            <div className="relative overflow-hidden flex-1">
              <div
                className="flex h-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  transform: `translateX(-${modeOrder.indexOf(mode) * 100}%)`,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Login Form */}
                <div className="w-full flex-shrink-0 px-1 flex flex-col justify-start h-full pt-8">
                  <form
                    onSubmit={handleLoginSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <div>
                      <GlassInput
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        {...registerLogin('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address',
                          },
                        })}
                        error={loginErrors.email?.message}
                      />
                    </div>

                    <div>
                      <GlassInput
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        {...registerLogin('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                        })}
                        error={loginErrors.password?.message}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...registerLogin('remember')}
                          className="w-4 h-4 rounded-lg border-white/40 bg-white/10 text-white focus:ring-offset-0 focus:ring-2 focus:ring-white/50 transition-all duration-200"
                        />
                        <span className="text-xs text-white/70 group-hover:text-white/90 transition-colors duration-200">
                          Remember me
                        </span>
                      </label>
                    </div>

                    <div>
                      <GlassButton
                        type="submit"
                        disabled={loading}
                        loading={loading}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </GlassButton>
                    </div>
                  </form>
                </div>

                {/* Register Form */}
                <div className="w-full flex-shrink-0 px-1 flex flex-col justify-start h-full pt-8">
                  <form
                    onSubmit={handleRegisterSubmit(onRegister)}
                    className="space-y-4"
                  >
                    <div>
                      <GlassInput
                        type="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        {...registerRegister('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address',
                          },
                        })}
                        error={registerErrors.email?.message}
                      />
                    </div>

                    <div>
                      <GlassInput
                        type="password"
                        label="Password"
                        placeholder="Create a password"
                        {...registerRegister('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Must contain uppercase, lowercase, and number',
                          },
                        })}
                        error={registerErrors.password?.message}
                      />
                    </div>

                    <div>
                      <GlassInput
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        {...registerRegister('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) => value === password || 'Passwords do not match',
                        })}
                        error={registerErrors.confirmPassword?.message}
                      />
                    </div>

                    <div>
                      <GlassButton
                        type="submit"
                        disabled={loading}
                        loading={loading}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </GlassButton>
                    </div>
                  </form>
                </div>

                {/* Forgot Password Form */}
                <div className="w-full flex-shrink-0 px-1 flex flex-col justify-center h-full">
                  <div className="flex flex-col justify-start h-full pt-8">
                    {forgotStep === 'email' ? (
                      <form
                        onSubmit={handleForgotSubmit(onForgotPassword)}
                        className="space-y-4"
                      >
                        <div>
                          <GlassInput
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            {...registerForgot('email', {
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address',
                              },
                            })}
                            error={forgotErrors.email?.message}
                          />
                        </div>

                        <div>
                          <GlassButton
                            type="submit"
                            disabled={loading}
                            loading={loading}
                            className="w-full"
                            size="lg"
                          >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                          </GlassButton>
                        </div>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => handleModeChange('login')}
                            className="text-xs text-white/50 hover:text-white/80 transition-colors duration-200"
                          >
                            ← Back to Sign In
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30 backdrop-blur-sm">
                          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-base text-white/90 drop-shadow-md">
                            Check your inbox
                          </p>
                          <p className="text-sm text-white/60 mt-1">
                            We've sent a password reset link to
                          </p>
                          <p className="text-sm font-medium text-white/80 mt-1">
                            {resetEmail}
                          </p>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => handleModeChange('login')}
                            className="text-xs text-white/50 hover:text-white/80 transition-colors duration-200"
                          >
                            ← Back to Sign In
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容区域 - 待设计 */}
          <div className="w-2/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/50 text-sm">Coming Soon</p>
            </div>
          </div>
        </GlassCard>
    </GlassAuthBackground>
  )
}