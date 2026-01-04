import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 公开路由列表
  const publicRoutes = [
    '/',
    '/products',
    '/products/[id]',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/api/auth/callback'
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
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 如果有会话但访问管理端，检查是否是管理员
  if (session && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
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