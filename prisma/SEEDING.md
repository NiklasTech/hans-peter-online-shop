# Database Seeding Guide

Dieses Projekt verwendet Faker.js, um realistische Test-Daten für den Shop zu generieren.

## Verfügbare Seed-Scripts

### 1. User Seeding
```bash
npm run db:seed:users
```

Erstellt:
- ✅ **1 Admin-User**
  - Email: `admin@hanspeter.shop`
  - Passwort: `admin123`
  - Rolle: Admin

- ✅ **2 Test-User**
  - Email: `max@example.com` / `erika@example.com`
  - Passwort: `user123`
  - Rolle: Kunde

### 2. Produkt Seeding
```bash
npm run db:seed:products
```

Erstellt:
- ✅ **10 Kategorien** (Elektronik, Mode, Haushalt, Sport, etc.)
- ✅ **27 Marken** (NVIDIA, Apple, Nike, Adidas, etc.)
- ✅ **~300-500 Produkte** mit:
  - Realistischen Namen und Beschreibungen
  - Preisen zwischen €9.99 und €999.99
  - Lagerbeständen (0-100 Stück)
  - Produktbildern (via Picsum)
  - 3 zusätzlichen Bildern pro Produkt
  - Produktdetails (Marke, Gewicht, Material, etc.)

### 3. Alles auf einmal
```bash
npm run db:seed:all
```

Führt beide Seed-Scripts nacheinander aus.

## Produktkategorien

Das Seed-Script erstellt Produkte in folgenden Kategorien:

1. **Elektronik** - Laptops, Smartphones, Monitore, Grafikkarten, etc.
2. **Mode** - T-Shirts, Jeans, Schuhe, Accessoires
3. **Haushalt** - Küchengeräte, Möbel, Lampen
4. **Sport** - Sportgeräte, Fitnessausrüstung, Bälle
5. **Bücher** - Romane, Krimis, Sachbücher
6. **Spielzeug** - Puppen, Brettspiele, Ferngesteuerte Autos
7. **Garten** - Rasenmäher, Gartenmöbel, Pflanzen
8. **Automobile** - Autozubehör, Werkzeug
9. **Beauty** - Kosmetik, Pflegeprodukte
10. **Lebensmittel** - Kaffee, Tee, Gewürze

## Produktvariationen

Jedes Produkt wird mit Variationen erstellt:
- **Adjektive**: Premium, Deluxe, Pro, Ultra, etc.
- **Farben**: Schwarz, Weiß, Rot, Blau, Grün, etc.
- **Größen** (Mode): S, M, L, XL, XXL

## Beispiel-Produkte

- "NVIDIA Premium Grafikkarte - Schwarz"
- "Nike Pro Laufschuhe (L)"
- "Apple Ultra Smartphone"
- "IKEA Modern Sofa - Grau"
- "LEGO Deluxe Bauklötze"

## Produktbilder

Alle Bilder werden von [Picsum Photos](https://picsum.photos/) geladen:
- **Preview-Bild**: 400x400px
- **Detail-Bilder**: 800x800px (3 Stück pro Produkt)

Die Bilder sind zufällig, aber über einen Seed eindeutig reproduzierbar.

## Datenbank zurücksetzen

Wenn du die Datenbank komplett neu aufsetzen möchtest:

```bash
# 1. Datenbank löschen (Optional - nur wenn nötig)
# Über dein Datenbank-Tool oder:
npx prisma migrate reset

# 2. Migrationen ausführen
npm run db:migrate:dev

# 3. Daten einfügen
npm run db:seed:all
```

## Anpassungen

Um die generierten Daten anzupassen, bearbeite:
- `prisma/seed-users.ts` - User-Daten
- `prisma/seed-products.ts` - Produkt-Daten

### Anzahl der Produkte ändern

In `seed-products.ts` Zeile ~130:
```typescript
const productsPerTemplate = 3; // Ändere diese Zahl
```

### Neue Kategorien hinzufügen

In `seed-products.ts` das Array `CATEGORIES` erweitern.

### Neue Marken hinzufügen

In `seed-products.ts` das Array `BRANDS` erweitern.

## Tipps

- **Locale**: Das Script verwendet die deutsche Faker-Locale (`de`)
- **Wiederholbarkeit**: Faker generiert bei jedem Durchlauf neue Daten
- **Performance**: Das Seeding von 500+ Produkten dauert ~30-60 Sekunden

## Troubleshooting

### Error: "Module not found"
```bash
npm install @faker-js/faker --save-dev
```

### Error: "Pool connection failed"
Prüfe deine `DATABASE_URL` in der `.env` Datei.

### Error: "Unique constraint failed"
Die Datenbank enthält bereits Daten. Nutze `prisma migrate reset` oder ändere die Daten im Seed-Script.
