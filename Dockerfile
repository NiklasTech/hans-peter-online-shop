# Dockerfile für Hans Peter Online Shop
FROM node:20-alpine AS base

# Installiere Abhängigkeiten nur wenn nötig
FROM base AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./
RUN npm install

# Build-Stage
FROM base AS builder
RUN apk add --no-cache git libc6-compat openssl

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generiere Prisma Client (DATABASE_URL wird als Build-Argument übergeben)
ARG DATABASE_URL
RUN npx prisma generate

# Build Next.js App
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production-Stage
FROM base AS runner
RUN apk add --no-cache openssl bash
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiere notwendige Dateien
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Kopiere Startup-Script
COPY --chown=nextjs:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Setze Berechtigungen
RUN mkdir -p /app/public/productImages

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/app/docker-entrypoint.sh"]
