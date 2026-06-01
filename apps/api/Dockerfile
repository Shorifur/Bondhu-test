# ── Bondhu API Dockerfile ──
# Build:  docker build -t bondhu-api .
# Run:    docker run -p 3001:3001 --env-file .env bondhu-api

# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps
WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# ── Stage 2: Builder ──
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
COPY src ./src/

# Install all dependencies (including dev)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# ── Stage 3: Production ──
FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Don't run as root
RUN addgroup --system --gid 1001 bondhu && \
    adduser --system --uid 1001 --ingroup bondhu bondhu

# Copy production dependencies
COPY --from=deps --chown=bondhu:bondhu /app/node_modules ./node_modules
COPY --chown=bondhu:bondhu package*.json ./

# Copy built application
COPY --from=builder --chown=bondhu:bondhu /app/dist ./dist
COPY --from=builder --chown=bondhu:bondhu /app/prisma ./prisma

# Copy Prisma client (generated in builder)
COPY --from=builder --chown=bondhu:bondhu /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=bondhu:bondhu /app/node_modules/@prisma ./node_modules/@prisma

USER bondhu

# Expose API port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/v1/health || exit 1

# Start: run migrations then start server
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed || true && node dist/main.js"]
