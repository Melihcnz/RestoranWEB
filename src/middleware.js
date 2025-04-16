import { NextResponse } from 'next/server'

// Bu array'e korumalı route'ları ekliyoruz
const protectedRoutes = [
  '/dashboard',
  '/data',
  '/analytics',
  '/projects',
  '/team',
  '/settings'
]

// Bu array'e public route'ları ekliyoruz
const publicRoutes = [
  '/login',
  '/register'
]

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Eğer korumalı bir route'a erişilmeye çalışılıyorsa ve token yoksa
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    return response
  }

  // Eğer login/register sayfalarına token varken erişilmeye çalışılıyorsa
  if (publicRoutes.includes(pathname) && token) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    return response
  }

  return NextResponse.next()
}

// Middleware'in çalışacağı path'leri belirtiyoruz
export const config = {
  matcher: [...protectedRoutes, ...publicRoutes]
} 