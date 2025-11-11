// Monitoring and logging utilities for production

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
  error?: Error;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private enableDebug = process.env.ENABLE_DEBUG_LOGS === 'true';

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, metadata, userId, requestId, error } = entry;
    
    const logObject = {
      level,
      message,
      timestamp,
      ...(userId && { userId }),
      ...(requestId && { requestId }),
      ...(metadata && { metadata }),
      ...(error && { 
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      }),
    };

    return JSON.stringify(logObject);
  }

  private shouldLog(level: keyof LogLevel): boolean {
    if (!this.isProduction) return true;
    if (level === 'DEBUG' && !this.enableDebug) return false;
    return true;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formattedLog = this.formatLog(entry);
    
    switch (entry.level) {
      case 'ERROR':
        console.error(formattedLog);
        break;
      case 'WARN':
        console.warn(formattedLog);
        break;
      case 'INFO':
        console.info(formattedLog);
        break;
      case 'DEBUG':
        console.debug(formattedLog);
        break;
    }

    // Send to external monitoring service in production
    if (this.isProduction && process.env.SENTRY_DSN) {
      this.sendToSentry(entry);
    }
  }

  private sendToSentry(entry: LogEntry): void {
    // This would integrate with Sentry or another monitoring service
    // For now, we'll just log that we would send it
    if (entry.level === 'ERROR' && entry.error) {
      // In a real implementation, you would use Sentry SDK here
      console.log('Would send to Sentry:', entry.error.message);
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>, userId?: string, requestId?: string): void {
    this.log({
      level: 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      error,
      metadata,
      userId,
      requestId,
    });
  }

  warn(message: string, metadata?: Record<string, any>, userId?: string, requestId?: string): void {
    this.log({
      level: 'WARN',
      message,
      timestamp: new Date().toISOString(),
      metadata,
      userId,
      requestId,
    });
  }

  info(message: string, metadata?: Record<string, any>, userId?: string, requestId?: string): void {
    this.log({
      level: 'INFO',
      message,
      timestamp: new Date().toISOString(),
      metadata,
      userId,
      requestId,
    });
  }

  debug(message: string, metadata?: Record<string, any>, userId?: string, requestId?: string): void {
    this.log({
      level: 'DEBUG',
      message,
      timestamp: new Date().toISOString(),
      metadata,
      userId,
      requestId,
    });
  }
}

// Singleton logger instance
export const logger = new Logger();

// Request tracking
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.metrics.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.metrics.get(name);
    if (!startTime) {
      logger.warn(`Timer ${name} was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);

    logger.info(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms` });
    
    return duration;
  }

  recordMetric(name: string, value: number, unit: string = 'ms'): void {
    logger.info(`Metric: ${name}`, { value, unit });
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendMetricToService(name, value, unit);
    }
  }

  private sendMetricToService(name: string, value: number, unit: string): void {
    // This would integrate with a metrics service like DataDog, New Relic, etc.
    console.log(`Would send metric to service: ${name} = ${value}${unit}`);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Error boundary for API routes
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string
) {
  return async (...args: T): Promise<R> => {
    const requestId = generateRequestId();
    
    try {
      performanceMonitor.startTimer(context);
      const result = await fn(...args);
      performanceMonitor.endTimer(context);
      
      return result;
    } catch (error) {
      performanceMonitor.endTimer(context);
      
      logger.error(
        `Error in ${context}`,
        error instanceof Error ? error : new Error(String(error)),
        { context },
        undefined,
        requestId
      );
      
      throw error;
    }
  };
}

// Database query monitoring
export function withDatabaseMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  queryName: string
) {
  return withErrorHandling(fn, `database:${queryName}`);
}

// API route monitoring
export function withAPIMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  routeName: string
) {
  return withErrorHandling(fn, `api:${routeName}`);
}

// Health check utilities
export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
}

export async function runHealthChecks(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = [];
  
  // Database health check
  try {
    const start = performance.now();
    // This would be replaced with actual database ping
    await new Promise(resolve => setTimeout(resolve, 10));
    const responseTime = performance.now() - start;
    
    checks.push({
      name: 'database',
      status: 'healthy',
      responseTime,
    });
  } catch (error) {
    checks.push({
      name: 'database',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  // External API health checks
  const externalAPIs = [
    { name: 'visa-photo-api', url: process.env.VISA_PHOTO_WEBHOOK_URL },
    { name: 'absher-api', url: process.env.ABSHER_WEBHOOK_URL },
    { name: 'saudi-look-api', url: process.env.SAUDI_LOOK_WEBHOOK_URL },
    { name: 'baby-photo-api', url: process.env.BABY_PHOTO_WEBHOOK_URL },
  ];
  
  for (const api of externalAPIs) {
    if (!api.url) {
      checks.push({
        name: api.name,
        status: 'degraded',
        error: 'API URL not configured',
      });
      continue;
    }
    
    try {
      const start = performance.now();
      // In a real implementation, you would make an actual health check request
      await new Promise(resolve => setTimeout(resolve, 50));
      const responseTime = performance.now() - start;
      
      checks.push({
        name: api.name,
        status: 'healthy',
        responseTime,
      });
    } catch (error) {
      checks.push({
        name: api.name,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  return checks;
}