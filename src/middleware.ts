export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes
const protectedRoutes = [
  '/dashboard',
  '/dashboard/add-task',
  '/dashboard/tasks',
  '/dashboard/tasks-list',
  '/dashboard/profile'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If the route is not protected, allow access
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  // Check if the user is authenticated
  const sessionResponse = await fetch(new URL('/api/auth/session', request.url), {
    headers: {
      cookie: request.headers.get('cookie') || ''
    }
  })

  const session = sessionResponse.ok ? await sessionResponse.json() : null
  
  // If the user is not authenticated, redirect to the login page
  if (!session?.user) {
    const url = new URL('/sign-in', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// Configuration of routes that the middleware should process
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}