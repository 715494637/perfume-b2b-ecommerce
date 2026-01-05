import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const COOKIE_NAME = 'auth_token'

// JWT Payload 类型
export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// 令牌有效期：7 天
const TOKEN_EXPIRY = '7d'

/**
 * 生成 JWT Token
 * @param userId 用户 ID
 * @param email 用户邮箱
 * @returns JWT Token
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

/**
 * 验证 JWT Token
 * @param token JWT Token
 * @returns 解码后的 payload 或 null
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * 从 Cookie 获取当前用户
 * @returns 用户信息或 null
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

/**
 * 设置认证 Cookie
 * @param token JWT Token
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 天
    path: '/',
  })
}

/**
 * 清除认证 Cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * 刷新 Token
 * @param currentToken 当前 Token
 * @returns 新 Token 或 null
 */
export function refreshToken(currentToken: string): string | null {
  const payload = verifyToken(currentToken)
  if (!payload) {
    return null
  }

  return generateToken(payload.userId, payload.email)
}