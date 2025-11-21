# Prisma Setup & Database Guide

Dieses Guide zeigt dir, wie du **Prisma einrichtest**, die **Datenbank verwaltst** und **Migrations** durchführst.

## Inhaltsverzeichnis

1. [Erste Installation](#erste-installation)
2. [Datenbank verbinden](#datenbank-verbinden)
3. [Schema anpassen](#schema-anpassen)
4. [Migrations erstellen](#migrations-erstellen)
5. [Daten anschauen (Prisma Studio)](#daten-anschauen)
6. [Häufige Fehler](#häufige-fehler)

---

## Erste Installation

### Schritt 1: Prisma installieren

```bash
npm install @prisma/client
npm install -D prisma
```

### Schritt 2: Prisma initialisieren

```bash
npx prisma init
```

Das erstellt:
- `prisma/schema.prisma` - Dein Datenbank-Schema
- `.env` - Environment-Variablen
- `prisma.config.ts` - Prisma Konfiguration

### Schritt 3: Datenbank-URL in `.env` eintragen

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
```

**Beispiel für lokale PostgreSQL (Docker):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/HansPeter?schema=public"
```

### Schritt 4: Erste Migration

```bash
npx prisma migrate dev --name init
```

Das:
- Erstellt die Migrations-Datei
- Erstellt die Tabellen in der DB
- Generiert den Prisma Client

---

## Datenbank verbinden

### Lokale PostgreSQL mit Docker

**1. Docker Compose starten:**
```bash
docker-compose up -d
```

**2. Datenbank-Verbindung testen:**
```bash
npx prisma db push
```

### Mit Cloud-Datenbank (z.B. Neon, Railway)

**1. URL kopieren** von deinem Cloud-Provider
**2. In `.env` eintragen:**
```env
DATABASE_URL="<deine-cloud-connection-url>"
```

**3. Testen:**
```bash
npx prisma db push
```

---

## Schema anpassen

### Dein aktuelles Schema

```typescript
// prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String
  password  String
  isAdmin   Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders     Order[]
  cart       CartItem[]
  wishlists  Wishlist[]
  reviews    Review[]
  chats      SupportChat[]
  messages   ChatMessage[]
}

// ... weitere Models ...
```

### Neues Feld hinzufügen

**Beispiel: Telefon-Nummer zum User hinzufügen**

```typescript
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String
  password  String
  phone     String?  // ← NEU: Optional
  isAdmin   Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // ... rest der Felder ...
}
```

### Neue Tabelle erstellen

**Beispiel: Newsletter Subscription**

```typescript
model Newsletter {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  subscribed Boolean @default(true)
  createdAt DateTime @default(now())

  @@index([email])
}
```

---

## Migrations erstellen

### Migration nach Schema-Änderung

**Schritt 1: Schema ändern**
```typescript
// In prisma/schema.prisma etwas ändern...
```

**Schritt 2: Migration erstellen & ausführen**
```bash
npx prisma migrate dev --name <NAME>
```

**Beispiele:**
```bash
# Neues Feld hinzufügen
npx prisma migrate dev --name add_phone_to_user

# Neue Tabelle
npx prisma migrate dev --name create_newsletter

# Feld umbenennen
npx prisma migrate dev --name rename_field_x_to_y
```

### Migration nur zur DB pushen (ohne Datei)

```bash
# Schnell ohne Migration-Datei (nur für Entwicklung!)
npx prisma db push
```

**Wann nutzen:**
- ✅ Lokale Entwicklung
- ✅ Prototyping
- ❌ Nicht für Production!

### Migration in Production deployen

```bash
# Nur die Migrations ausführen (keine neuen erstellen)
npx prisma migrate deploy
```

---

## Daten anschauen

### Prisma Studio starten

```bash
npx prisma studio
```

Das öffnet eine GUI im Browser auf `http://localhost:5555`

**Was kannst du dort machen:**
- ✅ Alle Daten anschauen
- ✅ Daten erstellen/editieren/löschen
- ✅ Queries testen
- ✅ Relationen anschauen

---

## Prisma Client verwenden

### Daten auslesen

```typescript
import { prisma } from "@/lib/db";

// Ein User
const user = await prisma.user.findUnique({
  where: { id: 1 }
});

// Alle Users
const users = await prisma.user.findMany();

// Mit Filter
const admins = await prisma.user.findMany({
  where: { isAdmin: true }
});
```

### Daten erstellen

```typescript
const newUser = await prisma.user.create({
  data: {
    email: "test@example.com",
    name: "Test User",
    password: "hashed-password",
    isAdmin: false
  }
});
```

### Daten updaten

```typescript
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: "New Name" }
});
```

### Daten löschen

```typescript
await prisma.user.delete({
  where: { id: 1 }
});
```

### Relationen laden

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    orders: true,        // Alle Orders des Users
    wishlists: true,     // Alle Wishlisten
    reviews: true        // Alle Reviews
  }
});
```

---

## Häufige Fehler

### ❌ "Error: P1017 - Server has closed the connection"

**Grund:** PostgreSQL läuft nicht oder ist nicht erreichbar

**Lösung:**
```bash
# Docker starten
docker-compose up -d

# Oder Verbindung testen
npx prisma db push
```

### ❌ "Error: P3000 - Migration already applied"

**Grund:** Migration wurde schon ausgeführt

**Lösung:**
```bash
# Status anschauen
npx prisma migrate status

# Wenn nötig zurücksetzen (NUR in DEV!)
npx prisma migrate reset
```

### ❌ "Cannot find module '@prisma/client'"

**Grund:** Prisma Client nicht installiert

**Lösung:**
```bash
npx prisma generate
npm install
```

### ❌ "Unique constraint failed"

**Grund:** Du versuchst einen doppelten Wert einzufügen

**Lösung:** Überprüfe `@unique` Felder im Schema

```typescript
model User {
  email String @unique  // ← Muss einzigartig sein!
}
```

---

## Workflow für dein Team

### Szenario 1: Neues Feld hinzufügen

```bash
# 1. Schema anpassen
# Datei: prisma/schema.prisma
model Product {
  // ... vorhandene Felder ...
  sku String?  // ← NEU
}

# 2. Migration erstellen
npx prisma migrate dev --name add_sku_to_product

# 3. Committen
git add prisma/
git commit -m "feat: Add SKU field to Product (#10)"
git push origin feature/#10-add-sku
```

### Szenario 2: Neue Tabelle erstellen

```bash
# 1. Schema anpassen
# Datei: prisma/schema.prisma
model Coupon {
  id    Int     @id @default(autoincrement())
  code  String  @unique
  discount Float
}

# 2. Migration
npx prisma migrate dev --name create_coupon

# 3. Committen
git add prisma/
git commit -m "feat: Add Coupon table (#15)"
```

### Szenario 3: Daten anschauen

```bash
# Prisma Studio starten
npx prisma studio

# Browser öffnet sich automatisch auf http://localhost:5555
# Dort kannst du alle Daten sehen und bearbeiten
```

---

## Wichtig: `.env` nicht committen!

Deine `.env` Datei sollte in `.gitignore` sein:

```
# .gitignore
.env
.env.local
.env.*.local
```

**Für dein Team:** Erstelle eine `.env.example`:

```
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

So wissen alle, welche Variablen sie brauchen!

---

## Schnelle Commands

```bash
# Neue Migration erstellen
npx prisma migrate dev --name <name>

# Migration nur ausführen
npx prisma migrate deploy

# Status anschauen
npx prisma migrate status

# Alles zurücksetzen (nur DEV!)
npx prisma migrate reset

# Prisma Client neu generieren
npx prisma generate

# Datenbank-Verbindung testen
npx prisma db push

# Daten anschauen
npx prisma studio

# Prisma Schema validieren
npx prisma validate
```

---

## Weitere Resources

- [Prisma Dokumentation](https://www.prisma.io/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Datenbank-Guides](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch)

---

**Fragen?** Schau in die [BRANCHING-STRATEGY.md](../BRANCHING-STRATEGY.md) für Git Workflow oder [README.md](../README.md) für Projekt-Übersicht!
