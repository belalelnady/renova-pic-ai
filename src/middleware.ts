import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { securityMiddleware, SecurityHeaders } from '@/lib/security'

const locales = ['en', 'ar']
const publicPages = ['/', '/signin', '/privacy', '/returns']

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
})

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
  }
)

export default async function middleware(req: NextRequest) {
  // Apply security middleware first
  const securityResponse = await securityMiddleware(req)
  if (securityResponse) {
    return SecurityHeaders.applyToResponse(securityResponse)
  }

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  )
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  let response: NextResponse

  if (isPublicPage) {
    response = intlMiddleware(req)
  } else {
    response = (authMiddleware as any)(req)
  }

  // Apply security headers to all responses
  return SecurityHeaders.applyToResponse(response)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}