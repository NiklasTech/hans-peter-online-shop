# ProductDetails - Datenbank-Tabelle & Speicherlogik

## ✅ Implementiert

### 1. **Datenbank-Tabelle `ProductDetail`**

```prisma
model ProductDetail {
  id        Int      @id @default(autoincrement())
  productId Int
  key       String
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}
```

**Migration:** `20251128095626_add_product_details`

### 2. **Product Model erweitert**

```prisma
model Product {
  // ...existing fields...
  details ProductDetail[]
}
```

### 3. **API-Endpunkte aktualisiert**

#### POST `/api/admin/products`
```typescript
{
  name: "Product",
  price: 99.99,
  details: [
    { key: "Material", value: "Aluminium" },
    { key: "Farbe", value: "Schwarz" }
  ]
}
```

Details werden automatisch mit dem Produkt erstellt.

#### PUT `/api/admin/products/[id]`
```typescript
{
  details: [
    { key: "Material", value: "Aluminium" },
    { key: "Farbe", value: "Schwarz" }
  ]
}
```

Beim Update werden **alle alten Details gelöscht** und neue erstellt.

#### GET `/api/admin/products` & GET `/api/admin/products/[id]`
Response inkludiert jetzt `details`:
```json
{
  "product": {
    "id": 1,
    "name": "Product",
    "details": [
      {
        "id": 1,
        "key": "Material",
        "value": "Aluminium",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

### 4. **ProductForm - Details werden gespeichert**

Die Details, die im Formular eingegeben werden, werden automatisch beim Speichern an die API gesendet:

```typescript
const productData = {
  // ...other fields...
  details: details
    .filter((d) => d.key.trim() && d.value.trim())
    .map((d) => ({ key: d.key.trim(), value: d.value.trim() })),
};
```

**Filterung:**
- Nur Zeilen mit **ausgefülltem Key UND Value** werden gespeichert
- Leere Zeilen werden ignoriert
- Whitespace wird entfernt (`trim()`)

### 5. **Details beim Laden**

Beim Bearbeiten eines Produkts werden die Details automatisch geladen:

```typescript
if (product.details && product.details.length > 0) {
  setDetails(
    product.details.map((d) => ({
      id: crypto.randomUUID(),
      key: d.key,
      value: d.value,
    }))
  );
}
```

### 6. **Umleitung nach Erstellung**

**Vorher:** Nach dem Erstellen → `/admin/products` (Übersicht)

**Jetzt:**
- **Neu erstellt:** → `/admin/product/{id}` (Edit-Seite des neuen Produkts)
- **Bearbeitet:** → `/admin/products` (Übersicht)

```typescript
setTimeout(() => {
  if (isEditing) {
    router.push("/admin/products");
  } else {
    router.push(`/admin/product/${result.product.id}`);
  }
}, 1500);
```

## 🎯 Workflow

### Neues Produkt erstellen:
1. Fülle Produkt-Informationen aus
2. Füge Details hinzu (Material, Farbe, etc.)
3. Klicke "Produkt erstellen"
4. ✅ Erfolg-Meldung erscheint
5. ➡️ **Automatische Weiterleitung zur Edit-Seite des neuen Produkts**
6. Dort können weitere Anpassungen vorgenommen werden

### Produkt bearbeiten:
1. Ändere Produkt-Informationen
2. Ändere/Entferne/Füge Details hinzu
3. Klicke "Änderungen speichern"
4. ✅ Erfolg-Meldung erscheint
5. ➡️ **Weiterleitung zur Produktübersicht**

## 📊 Details im Formular

**Aktuelle Implementierung:**
- Dynamische Zeilen (wie bisher)
- Autocomplete für Keys mit Vorschlägen
- Automatisch neue Zeile beim Tippen
- X-Button zum Entfernen

**Details-Vorschläge:**
- Material
- Farbe
- Größe
- Gewicht
- Hersteller
- Herkunftsland
- Garantie
- Energieeffizienz
- Abmessungen
- Volumen

## 🗄️ Datenbankstruktur

```sql
CREATE TABLE "ProductDetail" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "key" VARCHAR NOT NULL,
  "value" VARCHAR NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL,
  
  FOREIGN KEY ("productId") 
    REFERENCES "Product"("id") 
    ON DELETE CASCADE
);

CREATE INDEX "ProductDetail_productId_idx" 
  ON "ProductDetail"("productId");
```

**ON DELETE CASCADE:** Wenn ein Produkt gelöscht wird, werden automatisch alle zugehörigen Details gelöscht.

## 🔄 Update-Verhalten

Beim Update eines Produkts:
1. **Alle alten Details werden gelöscht** (`deleteMany: {}`)
2. **Neue Details werden erstellt** (basierend auf Formular-Input)

**Warum nicht inkrementell?**
- Einfacher und konsistenter
- Verhindert Duplikate
- Keine Synchronisationsprobleme
- Frontend entscheidet, welche Details bleiben

## 📝 TypeScript Types

```typescript
export interface ProductDetail {
  id: number;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  // ...
  details?: ProductDetail[];
}
```

## ✅ Validierung

**Frontend:**
- Details sind optional
- Leere Zeilen werden gefiltert
- Key UND Value müssen ausgefüllt sein

**Backend:**
- Keine Validierung (Details sind optional)
- Filter im API-Handler entfernt leere Einträge

## 🎨 UI im Formular

Die Details-Sektion ist bereits im Formular vorhanden unter "Produkt-Details":

```tsx
<Card>
  <CardHeader>
    <CardTitle>Produkt-Details</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {details.map((detail) => (
      <div key={detail.id} className="flex gap-2">
        <Input 
          value={detail.key}
          placeholder="z.B. Material"
          list="suggestions"
        />
        <Input 
          value={detail.value}
          placeholder="Wert eingeben"
        />
        <Button onClick={() => removeDetail(detail.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </CardContent>
</Card>
```

## 🐛 Troubleshooting

### Details werden nicht gespeichert
- Prüfe ob Key UND Value ausgefüllt sind
- Prüfe Netzwerk-Tab für API-Fehler
- Prüfe Browser-Console für Fehler

### Details erscheinen nicht beim Bearbeiten
- Prüfe ob API `details` inkludiert
- Prüfe Browser-Console für Fehler
- Prüfe ob `product.details` im Response vorhanden ist

### Alte Details bleiben nach Update
- Das sollte nicht passieren (deleteMany)
- Prüfe API-Log für Fehler
- Prüfe Datenbankinhalt direkt

## 📚 Migration durchführen

Falls du die Änderungen übernehmen möchtest:

```bash
# Migration wurde bereits durchgeführt:
# npx prisma migrate dev --name add-product-details

# Client wurde bereits generiert:
# npx prisma generate

# Server neu starten:
npm run dev
```

## 🎉 Fertig!

- ✅ ProductDetail Tabelle erstellt
- ✅ API-Endpunkte erweitert
- ✅ Details werden gespeichert
- ✅ Details werden geladen
- ✅ Umleitung nach Erstellung geändert
- ✅ TypeScript Types aktualisiert

