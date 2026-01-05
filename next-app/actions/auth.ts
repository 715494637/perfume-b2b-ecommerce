'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/auth/password'
import {
  generateToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie,
  getCurrentUser,
} from '@/lib/auth/jwt'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  generateSecureToken,
} from '@/lib/auth/email'

/**
 * 用户注册
 */
export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: '请输入有效的邮箱地址' }
  }

  // 验证密码强度
  const passwordValidation = validatePasswordStrength(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.errors.join(', ') }
  }

  const supabase = await createClient()

  try {
    // 检查邮箱是否已存在
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return { error: '该邮箱已被注册' }
    }

    // 生成验证令牌
    const verificationToken = generateSecureToken()
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 小时

    // 哈希密码
    const passwordHash = await hashPassword(password)

    // 创建用户
    const { error: insertError } = await supabase.from('profiles').insert({
      email: email.toLowerCase(),
      full_name: displayName || email.split('@')[0],
      password_hash: passwordHash,
      email_verified: false,
      verification_token: verificationToken,
      verification_token_expires_at: verificationTokenExpiresAt,
      role: 'user',
    })

    if (insertError) {
      console.error('创建用户失败:', insertError)
      return { error: '注册失败，请稍后重试' }
    }

    // 发送验证邮件
    const emailResult = await sendVerificationEmail(email, verificationToken)
    if (!emailResult.success) {
      console.error('发送验证邮件失败:', emailResult.error)
      // 即使邮件发送失败，也允许注册成功
      return {
        success: true,
        message: '注册成功，但验证邮件发送失败，请联系客服',
      }
    }

    return {
      success: true,
      message: '注册成功！请查看邮箱并点击验证链接',
    }
  } catch (error) {
    console.error('注册错误:', error)
    return { error: '注册失败，请稍后重试' }
  }
}

/**
 * 用户登录
 */
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string

  const supabase = await createClient()

  try {
    // 查找用户
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      console.error('查找用户失败:', error)
      return { error: '邮箱或密码错误' }
    }

    if (!user) {
      console.error('用户不存在:', email)
      return { error: '邮箱或密码错误' }
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return { error: '邮箱或密码错误' }
    }

    // 检查邮箱是否已验证
    if (!user.email_verified) {
      return {
        error: '请先验证您的邮箱地址',
        requireVerification: true,
        email: user.email,
      }
    }

    // 更新最后登录时间
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // 生成 JWT token
    const token = generateToken(user.id, user.email)

    // 设置认证 cookie
    await setAuthCookie(token)

    revalidatePath('/', 'layout')

    // 返回成功而不是重定向，让客户端处理
    return { success: true }
  } catch (error) {
    console.error('登录错误:', error)
    return { error: '登录失败，请稍后重试' }
  }
}

/**
 * 用户登出
 */
export async function signOut() {
  await clearAuthCookie()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

/**
 * 验证邮箱
 */
export async function verifyEmail(token: string) {
  const supabase = await createClient()

  try {
    // 查找使用该验证令牌的用户
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_token', token)
      .single()

    if (error || !user) {
      return { error: '无效的验证链接' }
    }

    // 检查令牌是否过期
    if (
      user.verification_token_expires_at &&
      new Date(user.verification_token_expires_at) < new Date()
    ) {
      return { error: '验证链接已过期，请重新发送验证邮件' }
    }

    // 更新用户状态
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expires_at: null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('验证邮箱失败:', updateError)
      return { error: '验证失败，请稍后重试' }
    }

    return { success: true }
  } catch (error) {
    console.error('验证邮箱错误:', error)
    return { error: '验证失败，请稍后重试' }
  }
}

/**
 * 重新发送验证邮件
 */
export async function resendVerificationEmail(email: string) {
  const supabase = await createClient()

  try {
    // 查找用户
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) {
      return { error: '用户不存在' }
    }

    // 检查邮箱是否已验证
    if (user.email_verified) {
      return { error: '邮箱已验证' }
    }

    // 生成新的验证令牌
    const verificationToken = generateSecureToken()
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 小时

    // 更新验证令牌
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_token: verificationToken,
        verification_token_expires_at: verificationTokenExpiresAt,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('更新验证令牌失败:', updateError)
      return { error: '发送失败，请稍后重试' }
    }

    // 发送验证邮件
    const emailResult = await sendVerificationEmail(email, verificationToken)
    if (!emailResult.success) {
      return { error: '发送邮件失败，请稍后重试' }
    }

    return { success: true, message: '验证邮件已发送' }
  } catch (error) {
    console.error('重发验证邮件错误:', error)
    return { error: '发送失败，请稍后重试' }
  }
}

/**
 * 请求重置密码
 */
export async function requestPasswordReset(email: string) {
  const supabase = await createClient()

  try {
    // 查找用户
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) {
      // 为了安全，即使邮箱不存在也返回成功
      return { success: true, message: '如果该邮箱已注册，您将收到重置密码的邮件' }
    }

    // 检查邮箱是否已验证
    if (!user.email_verified) {
      return { error: '请先验证您的邮箱地址' }
    }

    // 生成重置令牌
    const resetToken = generateSecureToken()
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 小时

    // 更新重置令牌
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        reset_token: resetToken,
        reset_token_expires_at: resetTokenExpiresAt,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('更新重置令牌失败:', updateError)
      return { error: '发送失败，请稍后重试' }
    }

    // 发送重置邮件
    const emailResult = await sendPasswordResetEmail(email, resetToken)
    if (!emailResult.success) {
      return { error: '发送邮件失败，请稍后重试' }
    }

    return { success: true, message: '重置密码邮件已发送' }
  } catch (error) {
    console.error('请求重置密码错误:', error)
    return { error: '发送失败，请稍后重试' }
  }
}

/**
 * 重置密码
 */
export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string

  // 验证密码强度
  const passwordValidation = validatePasswordStrength(password)
  if (!passwordValidation.valid) {
    return { error: passwordValidation.errors.join(', ') }
  }

  const supabase = await createClient()

  try {
    // 查找使用该重置令牌的用户
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('reset_token', token)
      .single()

    if (error || !user) {
      return { error: '无效的重置链接' }
    }

    // 检查令牌是否过期
    if (
      user.reset_token_expires_at &&
      new Date(user.reset_token_expires_at) < new Date()
    ) {
      return { error: '重置链接已过期，请重新申请' }
    }

    // 哈希新密码
    const passwordHash = await hashPassword(password)

    // 更新密码
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expires_at: null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('重置密码失败:', updateError)
      return { error: '重置失败，请稍后重试' }
    }

    return { success: true, message: '密码重置成功，请使用新密码登录' }
  } catch (error) {
    console.error('重置密码错误:', error)
    return { error: '重置失败，请稍后重试' }
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUserProfile() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return null
  }

  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.userId)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

/**
 * 更新用户资料
 */
export async function updateProfile(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: '请先登录' }
  }

  const fullName = formData.get('fullName') as string
  const avatarUrl = formData.get('avatarUrl') as string

  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
    })
    .eq('id', currentUser.userId)

  if (error) {
    return { error: '更新失败，请稍后重试' }
  }

  revalidatePath('/account/profile')
  return { success: true }
}

/**
 * 修改密码
 */
export async function changePassword(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: '请先登录' }
  }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string

  const supabase = await createClient()

  try {
    // 获取当前用户信息
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.userId)
      .single()

    if (error || !user) {
      return { error: '用户不存在' }
    }

    // 验证当前密码
    const isPasswordValid = await verifyPassword(
      currentPassword,
      user.password_hash
    )
    if (!isPasswordValid) {
      return { error: '当前密码错误' }
    }

    // 验证新密码强度
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.valid) {
      return { error: passwordValidation.errors.join(', ') }
    }

    // 哈希新密码
    const passwordHash = await hashPassword(newPassword)

    // 更新密码
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ password_hash: passwordHash })
      .eq('id', currentUser.userId)

    if (updateError) {
      console.error('修改密码失败:', updateError)
      return { error: '修改失败，请稍后重试' }
    }

    return { success: true, message: '密码修改成功' }
  } catch (error) {
    console.error('修改密码错误:', error)
    return { error: '修改失败，请稍后重试' }
  }
}