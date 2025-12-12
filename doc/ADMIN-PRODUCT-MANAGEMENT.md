# Admin Produkt-Verwaltung

Diese Dokumentation beschreibt die neu implementierte Admin-Produktverwaltung mit vollständigem Frontend und Backend.

## Features

### ✅ Backend API Routes

#### **POST /api/admin/products**
Erstellt ein neues Produkt mit allen Informationen

#### **GET /api/admin/products**
Lädt alle Produkte mit Pagination

#### **GET /api/admin/products/[id]**
Lädt ein einzelnes Produkt mit allen Details und Bildern

#### **PUT /api/admin/products/[id]**
Aktualisiert ein bestehendes Produkt

#### **DELETE /api/admin/products/[id]**
Löscht ein Produkt

#### **POST /api/upload**
Upload-Route für Produktbilder (max. 5MB, Formate: JPG, PNG, GIF, WebP)

### ✅ Frontend Features

#### **1. Basis-Informationen**
- Produktname (Pflichtfeld)
- Beschreibung (optional)
- Preis (Pflichtfeld, positiv)
- Lagerbestand (Pflichtfeld, positiv)
- Vorschaubild URL (optional, wird automatisch das erste Bild verwendet)

#### **2. Drag & Drop Bildupload**
- Mehrere Bilder gleichzeitig hochladen
- Drag & Drop Zone für einfaches Hochladen
- Bilder per Drag & Drop sortieren
- Live-Vorschau während des Uploads
- Index-Anzeige für jedes Bild
- Einzelne Bilder löschen
- Upload-Status wird angezeigt (wie Websocket-Verhalten)

#### **3. Dynamische Detail-Felder**
- Key-Value Paare für Produktdetails
- Automatische neue Zeile beim Ausfüllen der letzten Zeile
- Key-Vorschläge (Material, Farbe, Größe, etc.)
- Zeilen einzeln löschen

#### **4. Echtzeit-Updates**
- Sofortige Anzeige hochgeladener Bilder
- Live-Feedback bei Upload-Fehlern
- Erfolgs-/Fehlermeldungen nach dem Speichern
- Automatische Weiterleitung nach erfolgreichem Erstellen

## Verwendung

### Neues Produkt erstellen
```
/admin/product
```

### Produkt bearbeiten
```
/admin/product/[id]
```

## Code-Struktur

### Components
- `components/admin/ProductForm.tsx` - Hauptkomponente für Erstellen/Bearbeiten

### API Routes
- `app/api/admin/products/route.ts` - GET (alle) & POST (erstellen)
- `app/api/admin/products/[id]/route.ts` - GET (einzeln), PUT (aktualisieren), DELETE (löschen)
- `app/api/upload/route.ts` - Bildupload

### Pages
- `app/admin/product/page.tsx` - Neues Produkt erstellen
- `app/admin/product/[id]/page.tsx` - Produkt bearbeiten

### Types
- `types/product.ts` - TypeScript Interfaces für Produkte

## Datenbankschema

Das Prisma Schema enthält:

### Product Model
```prisma
model Product {
  id           Int      @id @default(autoincrement())
  name         String
  description  String?
  price        Float
  previewImage String?
  stock        Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  images ProductImage[]
}
```

### ProductImage Model
```prisma
model ProductImage {
  id        Int      @id @default(autoincrement())
  productId Int
  index     Int      @default(0)
  url       String
  createdAt DateTime @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, index])
  @@index([productId])
}
```

## Technologie-Stack

- **Next.js 16** - React Framework
- **TypeScript** - Typsicherheit
- **Prisma** - ORM für Datenbankzugriff
- **PostgreSQL** - Datenbank
- **Shadcn/ui** - UI-Komponenten
- **Lucide React** - Icons
- **React Hook Form** - (bereit für Integration)
- **Zod** - (bereit für Validierung)

## Nächste Schritte

1. **Validierung**: Zod-Schema für robuste Validierung hinzufügen
2. **Image Optimization**: Next.js Image-Komponente statt `<img>` verwenden
3. **Detail Storage**: Produkt-Details in separater Tabelle speichern
4. **Categories**: Kategorie-Verwaltung implementieren
5. **Bulk Actions**: Mehrere Produkte gleichzeitig bearbeiten
6. **Advanced Search**: Filter und Suche für Produktliste

## Hinweise

- Bilder werden in `/public/uploads/products/` gespeichert
- Maximale Bildgröße: 5MB
- Unterstützte Formate: JPG, PNG, GIF, WebP
- Bilder werden automatisch beim Löschen des Produkts mitgelöscht (Cascade)
- Upload-Verzeichnis wird automatisch erstellt, falls nicht vorhanden

