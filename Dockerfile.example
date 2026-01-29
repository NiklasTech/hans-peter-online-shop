FROM node:20-alpine

# Installiere notwendige Dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Setze npm config für bessere Netzwerk-Stabilität
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000 && \
    npm config set registry https://registry.npmjs.org/

# Kopiere package files
COPY package*.json ./

# Installiere dependencies mit mehreren Retries
RUN npm ci || npm ci || npm ci

# Kopiere Prisma Schema
COPY prisma ./prisma/

# Generiere Prisma Client
RUN npx prisma generate

# Kopiere den Rest der Anwendung
COPY . .

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Setze Port
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Starte die Anwendung
CMD ["npm", "run", "start"]
