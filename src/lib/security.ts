import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// CSRF token generation and validation
export class CSRFProtection {
  private static readonly SECRET = process.env.CSRF_SECRET || 'default-csrf-secret'
  private static readonly TOKEN_LENGTH = 32

  static generateToken(sessionId: string): string {
    const timestamp = Date.now().toString()
    const randomBytes = crypto.randomBytes(this.TOKEN_LENGTH).toString('hex')
    const payload = `${sessionId}:${timestamp}:${randomBytes}`
    
    const hmac = crypto.createHmac('sha256', this.SECRET)
    hmac.update(payload)
    const signature = hmac.digest('hex')
    
    return Buffer.from(`${payload}:${signature}`).toString('base64')
  }

  static validateToken(token: string, sessionId: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const parts = decoded.split(':')
      
      if (parts.length !== 4) return false
      
      const [tokenSessionId, timestamp, randomBytes, signature] = parts
      
      // Validate session ID
      if (tokenSessionId !== sessionId) return false
      
      // Validate timestamp (token expires after 1 hour)
      const tokenTime = parseInt(timestamp)
      const now = Date.now()
      if (now - tokenTime > 3600000) return false // 1 hour
      
      // Validate signature
      const payload = `${tokenSessionId}:${timestamp}:${randomBytes}`
      const hmac = crypto.createHmac('sha256', this.SECRET)
      hmac.update(payload)
      const expectedSignature = hmac.digest('hex')
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    } catch {
      return false
    }
  }

  static async validateRequest(request: NextRequest, sessionId: string): Promise<boolean> {
    const token = request.headers.get('x-csrf-token') || 
                  request.headers.get('csrf-token') ||
                  (await request.formData()).get('_csrf_token') as string

    if (!token) return false
    
    return this.validateToken(token, sessionId)
  }
}

// Rate limiting implementation
export class RateLimiter {
  private static readonly DEFAULT_WINDOW = 60 * 1000 // 1 minute
  private static readonly DEFAULT_MAX_REQUESTS = 60

  static async checkRateLimit(
    identifier: string,
    action: string,
    options: {
      windowMs?: number
      maxRequests?: number
    } = {}
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const windowMs = options.windowMs || this.DEFAULT_WINDOW
    const maxRequests = options.maxRequests || this.DEFAULT_MAX_REQUESTS
    
    const key = `${identifier}:${action}`
    const now = Date.now()
    const windowStart = now - windowMs
    
    const current = rateLimitStore.get(key)
    
    if (!current || current.resetTime <= now) {
      // New window or expired window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      }
    }
    
    if (current.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }
    
    // Increment count
    current.count++
    rateLimitStore.set(key, current)
    
    return {
      allowed: true,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime
    }
  }

  static getClientIdentifier(request: NextRequest): string {
    // Try to get user ID from session first
    const userId = request.headers.get('x-user-id')
    if (userId) return `user:${userId}`
    
    // Fall back to IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
    return `ip:${ip}`
  }

  static async middleware(
    request: NextRequest,
    action: string,
    options?: { windowMs?: number; maxRequests?: number }
  ): Promise<Response | null> {
    const identifier = this.getClientIdentifier(request)
    const result = await this.checkRateLimit(identifier, action, options)
    
    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': options?.maxRequests?.toString() || this.DEFAULT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString()
          }
        }
      )
    }
    
    return null // Allow request to continue
  }
}

// Input sanitization utilities
export class InputSanitizer {
  static sanitizeHtml(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .trim()
  }

  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9\-_. ]/g, '') // Only allow safe characters
      .replace(/\.{2,}/g, '.') // Prevent directory traversal
      .replace(/^\.+/, '') // Remove leading dots
      .slice(0, 255) // Limit length
  }

  static sanitizeUrl(url: string): string | null {
    try {
      const parsed = new URL(url)
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null
      }
      
      return parsed.toString()
    } catch {
      return null
    }
  }

  static sanitizeSearchQuery(query: string): string {
    return query
      .replace(/[^\w\s\u0600-\u06FF\-]/g, '') // Only allow word characters, spaces, Arabic, and hyphens
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 100) // Limit length
  }
}

// Security headers utility
export class SecurityHeaders {
  static getSecurityHeaders(): Record<string, string> {
    return {
      // Prevent XSS attacks
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      
      // HTTPS enforcement
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      
      // Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://accounts.google.com https://api.openai.com",
        "frame-src 'self' https://accounts.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      
      // Referrer policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Permissions policy
      'Permissions-Policy': [
        'camera=(self)',
        'microphone=()',
        'geolocation=()',
        'payment=()'
      ].join(', ')
    }
  }

  static applyToResponse(response: Response | NextResponse | undefined): Response | NextResponse {
    // If no response provided, create a new NextResponse
    if (!response) {
      response = NextResponse.next()
    }
    
    // Ensure response has headers property
    if (!response.headers) {
      return response
    }
    
    const headers = this.getSecurityHeaders()
    
    Object.entries(headers).forEach(([key, value]) => {
      try {
        response!.headers.set(key, value)
      } catch (error) {
        // Silently ignore header setting errors in development
        console.warn(`Failed to set security header ${key}:`, error)
      }
    })
    
    return response
  }
}

// File upload security
export class FileUploadSecurity {
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ]
  
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' }
    }
    
    // Check MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed' }
    }
    
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp']
    
    if (!extension || !allowedExtensions.includes(extension)) {
      return { valid: false, error: 'Invalid file extension' }
    }
    
    return { valid: true }
  }
  
  static generateSecureFileName(originalName: string, userId: string): string {
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    const timestamp = Date.now()
    const randomId = crypto.randomBytes(16).toString('hex')
    
    return `${userId}_${timestamp}_${randomId}.${extension}`
  }
}

// Authentication security utilities
export class AuthSecurity {
  static validateSession(sessionData: any): boolean {
    if (!sessionData || typeof sessionData !== 'object') {
      return false
    }
    
    // Check required fields
    const requiredFields = ['user', 'expires']
    for (const field of requiredFields) {
      if (!(field in sessionData)) {
        return false
      }
    }
    
    // Check expiration
    const expires = new Date(sessionData.expires)
    if (expires <= new Date()) {
      return false
    }
    
    // Validate user object
    const user = sessionData.user
    if (!user || !user.id || !user.email) {
      return false
    }
    
    return true
  }
  
  static hashPassword(password: string): string {
    // Note: In production, use bcrypt or similar
    return crypto.createHash('sha256').update(password).digest('hex')
  }
  
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }
}

// API security middleware
export async function securityMiddleware(request: NextRequest): Promise<Response | null> {
  // Apply rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimitResult = await RateLimiter.middleware(request, 'api', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100 // 100 requests per minute
    })
    
    if (rateLimitResult) {
      return rateLimitResult
    }
  }
  
  // Apply stricter rate limiting for auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    const rateLimitResult = await RateLimiter.middleware(request, 'auth', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10 // 10 requests per 15 minutes
    })
    
    if (rateLimitResult) {
      return rateLimitResult
    }
  }
  
  // Apply even stricter rate limiting for upload routes
  if (request.nextUrl.pathname.includes('/upload')) {
    const rateLimitResult = await RateLimiter.middleware(request, 'upload', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5 // 5 uploads per minute
    })
    
    if (rateLimitResult) {
      return rateLimitResult
    }
  }
  
  return null // Allow request to continue
}