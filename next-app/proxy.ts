import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, type JWTPayload } from '@/lib/auth/jwt'
import { createClient } from '@/lib/supabase/server'

const COOKIE_NAME = 'auth_token'

/**
 * 从请求中获取 JWT Token
 */
function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value || null
}

/**
 * 验证 Token 并获取用户信息
 */
async function getCurrentUserFromToken(token: string): Promise<JWTPayload | null> {
  return verifyToken(token)
}

export async function proxy(req: NextRequest) {
  // 跳过静态资源文件
  const pathname = req.nextUrl.pathname
  const isStaticFile = /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js)$/i.test(pathname)

  if (isStaticFile) {
    return NextResponse.next()
  }

  // 获取并验证 Token
  const token = getTokenFromRequest(req)
  const user = token ? await getCurrentUserFromToken(token) : null

  // 公开路由列表
  const publicRoutes = [
    '/',
    '/products',
    '/products/[id]',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify',
  ]

  // 管理端路由前缀
  const adminRoutes = ['/admin']

  // 检查当前路径是否是公开路由
  const isPublicRoute = publicRoutes.some(route => {
    // 处理动态路由
    if (route.includes('[') && route.includes(']')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(req.nextUrl.pathname)
    }
    return req.nextUrl.pathname === route
  })

  // 检查是否是管理端路由
  const isAdminRoute = adminRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  // 如果没有会话且不是公开路由，重定向到登录页
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 如果有会话但访问管理端，检查是否是管理员
  if (user && isAdminRoute) {
    const supabase = createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.userId)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}