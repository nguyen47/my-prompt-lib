# syntax=docker.io/docker/dockerfile:1
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install dependencies for better-sqlite3 and Next.js
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    sqlite
WORKDIR /app

# Install dependencies based on package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create data directory for SQLite database
RUN mkdir -p data

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV AUTH_EMAIL=admin@promptlib.com
ENV AUTH_PASSWORD=promptlib123

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public files
COPY --from=builder /app/public ./public

# Create data directory and set permissions
RUN mkdir -p data && chown nextjs:nodejs data

# Copy standalone output and static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
