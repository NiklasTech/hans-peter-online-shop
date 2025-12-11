#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed!"
echo "🚀 Starting Next.js server..."

exec node server.js

