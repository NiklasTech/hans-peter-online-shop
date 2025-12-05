# Dockerfile für Hans Peter Online Shop
FROM node:20-alpine AS base

# Installiere Abhängigkeiten nur wenn nötig
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./
RUN npm ci

# Build-Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generiere Prisma Client
RUN npx prisma generate

# Build Next.js App
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production-Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiere notwendige Dateien
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Setze Berechtigungen
RUN mkdir -p /app/public/productImages
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

