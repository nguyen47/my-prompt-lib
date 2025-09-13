# Use the official Node.js 20 image as base (required for better-sqlite3@12.2.0)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install build dependencies for native modules like better-sqlite3
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev
WORKDIR /app

# Install all dependencies (including dev dependencies needed for build)
COPY package.json package-lock.json* ./
RUN npm ci

# Install production dependencies only
FROM base AS prod-deps
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
# Install build dependencies for the builder stage too
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create data directory for SQLite database
RUN mkdir -p data

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
# Install only SQLite runtime (no build tools needed)
RUN apk add --no-cache sqlite
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder from the project as this is not included in the build
COPY --from=builder /app/public ./public

# Create data directory and set permissions
RUN mkdir -p data && chown nextjs:nodejs data

# Copy production node_modules
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
