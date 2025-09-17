# ----------------------
# Deps (install devDependencies)
# ----------------------
FROM node:20-alpine3.19 AS deps
WORKDIR /app

# Install security updates
RUN apk update && apk upgrade

ENV NODE_ENV=development
RUN npm install -g pnpm@latest

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with integrity checks
RUN pnpm install --frozen-lockfile --shamefully-hoist=false

# ----------------------
# Build
# ----------------------
FROM node:20-alpine3.19 AS builder
WORKDIR /app

RUN npm install -g pnpm@latest

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client and build
RUN pnpm run db:generate && \
    pnpm run build && \
    pnpm prune --prod

# ----------------------
# Runner (minimal)
# ----------------------
FROM node:20-alpine3.19 AS runner
WORKDIR /app

# Install runtime dependencies and security updates
RUN apk update && apk upgrade && \
    apk add --no-cache \
    libc6-compat \
    dumb-init \
    wget && \
    rm -rf /var/cache/apk/*

# Install Prisma CLI globally for migrations
RUN npm install -g prisma@6.15.0

# Create non-root user with specific IDs for better container orchestration
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nestjs

# Copy application files with proper ownership
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Set production environment with resource optimization
ENV NODE_ENV=production \
    PORT=3000 \
    NODE_OPTIONS="--max-old-space-size=460 --unhandled-rejections=strict" \
    NPM_CONFIG_CACHE=/tmp/.npm

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Use dumb-init as PID 1 for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/main"]

# Enhanced healthcheck with proper timeout and endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider --timeout=5 http://localhost:3001/api/v1/health || exit 1

# Metadata
LABEL maintainer="your-team@company.com" \
    version="1.0.0" \
    description="Production NestJS application"
