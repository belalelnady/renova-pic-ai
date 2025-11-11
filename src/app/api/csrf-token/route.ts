import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCSRFTokenResponse, createErrorResponse } from '@/lib/api-security'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return createErrorResponse('Authentication required', 401)
    }
    
    return createCSRFTokenResponse(session.user.id)
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return createErrorResponse('Failed to generate CSRF token', 500)
  }
}