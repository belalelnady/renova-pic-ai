#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.blue}${description}...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`${colors.green}✅ ${description} completed successfully${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ ${description} failed${colors.reset}`);
    throw error;
  }
}

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  log(`${colors.bright}🚀 Starting database migration and seeding...${colors.reset}`);
  log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

  try {
    // Generate Prisma client
    runCommand('npx prisma generate', 'Generating Prisma client');

    // Run database migrations
    if (isProduction) {
      runCommand('npx prisma migrate deploy', 'Deploying database migrations');
    } else {
      runCommand('npx prisma migrate dev', 'Running database migrations');
    }

    // Seed the database (only in development or if explicitly requested)
    if (!isProduction || process.argv.includes('--seed')) {
      runCommand('npx prisma db seed', 'Seeding database');
    }

    log(`\n${colors.green}${colors.bright}🎉 Database setup completed successfully!${colors.reset}`);
    
  } catch (error) {
    log(`\n${colors.red}${colors.bright}💥 Database setup failed!${colors.reset}`);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`${colors.red}Unhandled Rejection at: ${promise}, reason: ${reason}${colors.reset}`);
  process.exit(1);
});

main();