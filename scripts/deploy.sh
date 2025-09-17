#!/bin/bash

set -e

echo "🚀 Starting deployment process..."

# 1. Build the application
echo "📦 Building application..."
pnpm run build

# 2. Force regenerate Prisma client (useful for deployment verification)
echo "🔧 Regenerating Prisma client for deployment..."
pnpm run db:generate

# 3. Start the application with auto migration enabled
echo "🎯 Starting application..."
AUTO_MIGRATE=true NODE_ENV=production pnpm run start:prod

echo "✅ Deployment completed successfully!"
