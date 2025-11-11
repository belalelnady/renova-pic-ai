import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const startTime = Date.now();
  let databaseStatus = 'unknown';
  let databaseError = null;
  
  try {
    // Try to check database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'connected';
    } catch (dbError) {
      databaseStatus = 'disconnected';
      databaseError = dbError instanceof Error ? dbError.message : 'Database connection failed';
    }
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
    ];
    
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );
    
    const responseTime = Date.now() - startTime;
    
    // Return healthy if basic requirements are met, even if database is not connected
    const isHealthy = missingEnvVars.length === 0;
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      message: isHealthy ? 'System operational' : 'System partially operational',
      checks: {
        database: databaseStatus,
        environment: missingEnvVars.length === 0 ? 'configured' : 'missing variables',
        ...(databaseError && { databaseError }),
        ...(missingEnvVars.length > 0 && { missingEnvVars }),
      },
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    }, { 
      status: isHealthy ? 200 : (databaseStatus === 'disconnected' ? 503 : 500)
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch {
      // Ignore disconnect errors
    }
  }
}