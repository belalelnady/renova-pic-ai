
# AI Photo Editor - Next.js Migration

A professional AI-powered photo editing and printing service built with Next.js 14, featuring Google Authentication, PostgreSQL database, and bilingual support (English/Arabic).

## 🚀 Features

- 🤖 **AI-Powered Photo Editing**: Visa Photo, Absher Photo, Saudi Look, and Baby Photo processing
- 🔐 **Google Authentication**: Secure user authentication with Google OAuth
- 🗄️ **PostgreSQL Database**: Robust data storage with Prisma ORM
- 🌍 **Bilingual Support**: English and Arabic with RTL layout support
- 🛒 **E-commerce**: Shopping cart and order management system
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⚡ **Performance Optimized**: Image optimization, lazy loading, and caching strategies
- 🚀 **Production Ready**: Docker support, monitoring, and deployment automation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS with Shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Internationalization**: next-intl
- **File Storage**: Local storage with cloud storage support (AWS S3, Cloudinary)
- **Deployment**: Vercel, Docker, or any Node.js hosting platform
- **TypeScript**: Full type safety

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials
- (Optional) AWS S3 or Cloudinary for file storage

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd nextjs-photo-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/photo_app"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Add other required variables...
```

### 4. Set up the database

```bash
npm run db:setup
```

### 5. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database with sample data
- `npm run db:setup` - Run migrations and seeding

### Database Management

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Seed database
npm run db:seed
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Prepare for deployment**:
   ```bash
   npm run deploy:preview  # For preview deployment
   npm run deploy:production  # For production deployment
   ```

2. **Set environment variables** in Vercel dashboard

3. **Configure database**: Set up PostgreSQL (recommended: Supabase, PlanetScale, or AWS RDS)

### Docker

1. **Build the image**:
   ```bash
   docker build -t nextjs-photo-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 --env-file .env nextjs-photo-app
   ```

### Manual Deployment

1. **Build the application**:
   ```bash
   npm ci
   npm run build
   ```

2. **Set up production database**:
   ```bash
   NODE_ENV=production npm run db:migrate:deploy
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret (32+ chars) | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `AWS_S3_BUCKET` | AWS S3 bucket name | 🔶 |
| `CLOUDINARY_URL` | Cloudinary connection string | 🔶 |
| `SENTRY_DSN` | Sentry error tracking DSN | ❌ |

🔶 = Required for production file storage

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## 📊 Monitoring

### Health Checks

The application includes built-in health checks:

- **Endpoint**: `/api/health`
- **Checks**: Database connectivity, environment configuration
- **Response**: JSON with system status

### Performance Monitoring

Enable performance monitoring in production:

```env
ENABLE_PERFORMANCE_MONITORING=true
SENTRY_DSN=your-sentry-dsn
```

## 🔒 Security

### Security Headers

The application includes security headers:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

### Rate Limiting

Configure rate limiting:

```env
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000  # 15 minutes
```

## 📝 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # Shadcn/ui components
│   ├── layout/            # Layout components
│   ├── photo/             # Photo-related components
│   ├── cart/              # Cart components
│   └── common/            # Common components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── providers/             # React context providers
└── middleware.ts          # Next.js middleware
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run all checks
npm run deploy:preview
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.
