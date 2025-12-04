# Prisma 7 Database Setup - Fixes

## Problem
Der PrismaClient in Prisma 7 erfordert einen Database Adapter für die Verbindung zur Datenbank. Ohne Adapter tritt folgender Fehler auf:
```
TypeError: Cannot read properties of undefined (reading '__internal')
```

## Lösung

### 1. Database Adapter konfigurieren (`lib/db.ts`)

```typescript
import { PrismaClient } from "@/app/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// PostgreSQL Pool erstellen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Prisma Adapter erstellen
const adapter = new PrismaPg(pool);

// PrismaClient mit Adapter initialisieren
export const db = new PrismaClient({
  adapter,
});
```

### 2. Erforderliche Pakete

Stelle sicher, dass folgende Pakete installiert sind:
- `@prisma/adapter-pg` (bereits in package.json)
- `pg` (bereits in package.json)
- `@types/pg` (bereits in package.json)

### 3. Environment Variables

`.env` muss die `DATABASE_URL` enthalten:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/HansPeter?schema=public"
```

### 4. Nach Änderungen

Nach Änderungen an `lib/db.ts`:
1. `.next` Cache löschen: `Remove-Item -Recurse -Force .next`
2. Dev-Server neu starten: `npm run dev`

## Dokumentation

- [Prisma 7 Migration Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma PostgreSQL Adapter](https://www.prisma.io/docs/orm/overview/databases/postgresql#using-the-postgresql-driver-adapter)

