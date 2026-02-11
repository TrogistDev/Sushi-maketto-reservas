import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value
  const { pathname } = request.nextUrl

  // 1. A EXCEÇÃO: Se o caminho for a página de login, deixa passar sempre!
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // 2. PROTEÇÃO: Se tentar acessar qualquer outra coisa em /admin sem cookie
  if (pathname.startsWith('/admin') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Monitora apenas a pasta admin
  matcher: '/admin/:path*',
}