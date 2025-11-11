import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RateLimiter, CSRFProtection, InputSanitizer } from './security'
import { z } from 'zod'

// API route wrapper with security features
export function withApiSecurity<T = any>(
  handler: (req: NextRequest, context: { params?: any }) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean
    requireCSRF?: boolean
    rateLimit?: {
      windowMs?: number
      maxRequests?: number
    }
    validation?: {
      body?: z.ZodSchema<T>
      query?: z.ZodSchema<any>
    }
    allowedMethods?: string[]
  } = {}
) {
  return async (req: NextRequest, context: { params?: any } = {}) => {
    try {
      // Method validation
      if (options.allowedMethods && !options.allowedMethods.includes(req.method)) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        )
      }

      // Rate limiting
      if (options.rateLimit) {
        const identifier = RateLimiter.getClientIdentifier(req)
        const rateLimitResult = await RateLimiter.checkRateLimit(
          identifier,
          `${req.method}:${req.nextUrl.pathname}`,
          options.rateLimit
        )

        if (!rateLimitResult.allowed) {
          return NextResponse.json(
            { 
              error: 'Rate limit exceeded',
              retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
            },
            { 
              status: 429,
              headers: {
                'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
                'X-RateLimit-Limit': options.rateLimit.maxRequests?.toString() || '60',
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
              }
            }
          )
        }
      }

      // Authentication check
      if (options.requireAuth) {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }
      }

      // CSRF protection
      if (options.requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const session = await getServerSession(authOptions)
        const sessionId = session?.user?.id || 'anonymous'
        
        const isValidCSRF = await CSRFProtection.validateRequest(req, sessionId)
        if (!isValidCSRF) {
          return NextResponse.json(
            { error: 'CSRF token validation failed' },
            { status: 403 }
          )
        }
      }

      // Input validation
      if (options.validation) {
        // Validate request body
        if (options.validation.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
          try {
            const body = await req.json()
            const validatedBody = options.validation.body.parse(body)
            // Attach validated body to request for use in handler
            ;(req as any).validatedBody = validatedBody
          } catch (error) {
            if (error instanceof z.ZodError) {
              return NextResponse.json(
                { 
                  error: 'Validation failed',
                  details: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                  }))
                },
                { status: 400 }
              )
            }
            return NextResponse.json(
              { error: 'Invalid request body' },
              { status: 400 }
            )
          }
        }

        // Validate query parameters
        if (options.validation.query) {
          try {
            const url = new URL(req.url)
            const queryParams = Object.fromEntries(url.searchParams.entries())
            const validatedQuery = options.validation.query.parse(queryParams)
            ;(req as any).validatedQuery = validatedQuery
          } catch (error) {
            if (error instanceof z.ZodError) {
              return NextResponse.json(
                { 
                  error: 'Invalid query parameters',
                  details: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                  }))
                },
                { status: 400 }
              )
            }
            return NextResponse.json(
              { error: 'Invalid query parameters' },
              { status: 400 }
            )
          }
        }
      }

      // Call the actual handler
      return await handler(req, context)

    } catch (error) {
      console.error('API Security Error:', error)
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// Specific security wrappers for common scenarios
export function withAuthAndValidation<T>(
  handler: (req: NextRequest, context: { params?: any }) => Promise<NextResponse>,
  bodySchema: z.ZodSchema<T>
) {
  return withApiSecurity(handler, {
    requireAuth: true,
    requireCSRF: true,
    validation: { body: bodySchema },
    allowedMethods: ['POST', 'PUT', 'PATCH']
  })
}

export function withRateLimit(
  handler: (req: NextRequest, context: { params?: any }) => Promise<NextResponse>,
  rateLimit: { windowMs: number; maxRequests: number }
) {
  return withApiSecurity(handler, {
    rateLimit
  })
}

export function withFileUploadSecurity(
  handler: (req: NextRequest, context: { params?: any }) => Promise<NextResponse>
) {
  return withApiSecurity(handler, {
    requireAuth: true,
    requireCSRF: true,
    rateLimit: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5 // 5 uploads per minute
    },
    allowedMethods: ['POST']
  })
}

// Utility functions for API routes
export async function getValidatedSession(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    throw new Error('Authentication required')
  }
  
  return session
}

export function createApiResponse<T>(
  data: T,
  options: {
    status?: number
    headers?: Record<string, string>
  } = {}
) {
  const response = NextResponse.json(data, {
    status: options.status || 200,
    headers: options.headers
  })
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  
  return response
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: any
) {
  return NextResponse.json(
    { 
      error: message,
      ...(details && { details })
    },
    { status }
  )
}

// Input sanitization middleware for API routes
export function sanitizeApiInput(data: any): any {
  if (typeof data === 'string') {
    return InputSanitizer.sanitizeHtml(data)
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeApiInput)
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeApiInput(value)
    }
    return sanitized
  }
  
  return data
}

// CSRF token generation endpoint helper
export function createCSRFTokenResponse(sessionId: string) {
  const token = CSRFProtection.generateToken(sessionId)
  
  return createApiResponse({
    csrfToken: token
  })
}