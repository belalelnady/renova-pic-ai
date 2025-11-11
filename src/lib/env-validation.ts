import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DATABASE_URL_POOLED: z.string().url().optional(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  
  // File Storage
  UPLOAD_DIR: z.string().default('./uploads'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  CLOUDINARY_URL: z.string().optional(),
  
  // AI Webhooks
  VISA_PHOTO_WEBHOOK_URL: z.string().url().optional(),
  ABSHER_WEBHOOK_URL: z.string().url().optional(),
  SAUDI_LOOK_WEBHOOK_URL: z.string().url().optional(),
  BABY_PHOTO_WEBHOOK_URL: z.string().url().optional(),
  
  // Database Webhook
  DATABASE_WEBHOOK_URL: z.string().url().optional(),
  DATABASE_WEBHOOK_AUTH_TOKEN: z.string().optional(),
  
  // AI Webhook Auth Tokens
  VISA_PHOTO_AUTH_TOKEN: z.string().optional(),
  ABSHER_AUTH_TOKEN: z.string().optional(),
  SAUDI_LOOK_AUTH_TOKEN: z.string().optional(),
  BABY_PHOTO_AUTH_TOKEN: z.string().optional(),
  
  // Security
  CSRF_SECRET: z.string().min(32).optional(),
  RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default('100'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().positive()).default('900000'),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  ANALYTICS_ID: z.string().optional(),
  
  // Performance
  ENABLE_PERFORMANCE_MONITORING: z.string().transform(val => val === 'true').default('false'),
  REDIS_URL: z.string().url().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number().positive()).optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
});

// Production-specific validations
const productionSchema = envSchema.extend({
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters in production'),
  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET is required in production'),
}).refine(
  (data) => {
    // In production, require either AWS S3 or Cloudinary for file storage
    if (data.NODE_ENV === 'production') {
      return (
        (data.AWS_S3_BUCKET && data.AWS_ACCESS_KEY_ID && data.AWS_SECRET_ACCESS_KEY) ||
        data.CLOUDINARY_URL
      );
    }
    return true;
  },
  {
    message: 'Production requires either AWS S3 credentials or Cloudinary URL for file storage',
  }
);

// Validate environment variables
export function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const schema = isProduction ? productionSchema : envSchema;
  
  try {
    const env = schema.parse(process.env);
    
    // Log validation success in development
    if (!isProduction) {
      console.log('✅ Environment variables validated successfully');
    }
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      
      if (isProduction) {
        throw new Error('Environment validation failed in production');
      }
    }
    throw error;
  }
}

// Get validated environment variables
export const env = validateEnv();

// Environment-specific configurations
export const config = {
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  
  database: {
    url: env.DATABASE_URL_POOLED || env.DATABASE_URL,
    directUrl: env.DATABASE_URL,
  },
  
  auth: {
    url: env.NEXTAUTH_URL,
    secret: env.NEXTAUTH_SECRET,
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  storage: {
    uploadDir: env.UPLOAD_DIR,
    aws: env.AWS_S3_BUCKET ? {
      bucket: env.AWS_S3_BUCKET,
      accessKeyId: env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      region: env.AWS_REGION,
    } : null,
    cloudinary: env.CLOUDINARY_URL,
  },
  
  webhooks: {
    visaPhoto: {
      url: env.VISA_PHOTO_WEBHOOK_URL,
      authToken: env.VISA_PHOTO_AUTH_TOKEN,
    },
    absher: {
      url: env.ABSHER_WEBHOOK_URL,
      authToken: env.ABSHER_AUTH_TOKEN,
    },
    saudiLook: {
      url: env.SAUDI_LOOK_WEBHOOK_URL,
      authToken: env.SAUDI_LOOK_AUTH_TOKEN,
    },
    babyPhoto: {
      url: env.BABY_PHOTO_WEBHOOK_URL,
      authToken: env.BABY_PHOTO_AUTH_TOKEN,
    },
    database: {
      url: env.DATABASE_WEBHOOK_URL,
      authToken: env.DATABASE_WEBHOOK_AUTH_TOKEN,
    },
  },
  
  security: {
    csrfSecret: env.CSRF_SECRET,
    rateLimit: {
      max: env.RATE_LIMIT_MAX,
      windowMs: env.RATE_LIMIT_WINDOW,
    },
  },
  
  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    analyticsId: env.ANALYTICS_ID,
    enablePerformanceMonitoring: env.ENABLE_PERFORMANCE_MONITORING,
  },
  
  redis: {
    url: env.REDIS_URL,
  },
  
  email: {
    smtp: env.SMTP_HOST ? {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT!,
      user: env.SMTP_USER!,
      pass: env.SMTP_PASS!,
    } : null,
    from: env.FROM_EMAIL,
  },
};