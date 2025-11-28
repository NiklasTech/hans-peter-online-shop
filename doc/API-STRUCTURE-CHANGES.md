# API-Struktur Änderungen - Product Routes

## ✅ Durchgeführte Änderungen

### 1. **Image Upload mit Datenbank-Integration**

**Route:** `/api/admin/product/imageUpload`

#### Request
```typescript
POST /api/admin/product/imageUpload
Content-Type: multipart/form-data

FormData:
- file: File (image)
- productId: string (required)
- index: string (optional, default: 0)
```

#### Response
```json
{
  "image": {
    "id": 123,
    "productId": 456,
    "url": "/a/3/456/image.avif",
    "index": 0,
    "createdAt": "2025-11-28T10:00:00.000Z"
  }
}
```

#### Was passiert:
1. Bild wird validiert (Typ, Größe max 50MB)
2. ImageProcessor verarbeitet es als AVIF (max 2560x2560, quality 75)
3. **Bild wird in Datenbank gespeichert** (`ProductImage`)
4. **Vollständiger Datenbank-Eintrag wird zurückgegeben**

#### Sofortige Frontend-Anzeige:
Das zurückgegebene `image`-Objekt kann direkt im Frontend verwendet werden:

```typescript
const response = await fetch("/api/admin/product/imageUpload", {
  method: "POST",
  body: formData
});

const { image } = await response.json();

// Sofort im State hinzufügen
setImages(prev => [...prev, image]);
```

### 2. **Entfernung der [id]-Ordner-Struktur**

**Vorher:**
```
/api/admin/product/[id]/route.ts
  - GET    /api/admin/product/123
  - PUT    /api/admin/product/123
  - DELETE /api/admin/product/123
```

**Jetzt:**
```
/api/admin/product/route.ts
  - GET    /api/admin/product?id=123        (single)
  - GET    /api/admin/product               (all)
  - POST   /api/admin/product               (create)
  - PUT    /api/admin/product  {id: 123}    (update)
  - DELETE /api/admin/product?id=123        (delete)
```

## 📋 Neue API-Endpunkte

### GET `/api/admin/product`

#### Einzelnes Produkt
```typescript
GET /api/admin/product?id=123

Response:
{
  "product": {
    "id": 123,
    "name": "Product",
    "images": [...],
    "categories": [...],
    "brand": {...},
    "details": [...]
  }
}
```

#### Alle Produkte
```typescript
GET /api/admin/product?page=1&limit=50

Response:
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### POST `/api/admin/product`

```typescript
POST /api/admin/product
Content-Type: application/json

Body:
{
  "name": "Product",
  "price": 99.99,
  "stock": 100,
  "categoryIds": [1, 2],
  "brandId": 1,
  "images": [],
  "details": []
}

Response:
{
  "product": {...}
}
```

### PUT `/api/admin/product`

```typescript
PUT /api/admin/product
Content-Type: application/json

Body:
{
  "id": 123,           // ← ID im Body!
  "name": "Updated",
  "price": 119.99,
  ...
}

Response:
{
  "product": {...}
}
```

### DELETE `/api/admin/product`

```typescript
DELETE /api/admin/product?id=123

Response:
{
  "message": "Product deleted successfully"
}
```

## 🔄 Frontend-Anpassungen nötig

### ProductForm - Bild-Upload

**Vorher:**
```typescript
const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});

const { url } = await response.json();
```

**Jetzt:**
```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("productId", productId.toString());
formData.append("index", index.toString());

const response = await fetch("/api/admin/product/imageUpload", {
  method: "POST",
  body: formData,
});

const { image } = await response.json();

// image enthält: { id, productId, url, index, createdAt }
// Sofort im State verwenden:
setImages(prev => [...prev, image]);
```

### Produkt laden

**Vorher:**
```typescript
fetch(`/api/products/${productId}`)
```

**Jetzt:**
```typescript
fetch(`/api/admin/product?id=${productId}`)
```

### Produkt aktualisieren

**Vorher:**
```typescript
fetch(`/api/products/${productId}`, {
  method: "PUT",
  body: JSON.stringify(productData)
})
```

**Jetzt:**
```typescript
fetch("/api/admin/product", {
  method: "PUT",
  body: JSON.stringify({
    id: productId,  // ← ID im Body
    ...productData
  })
})
```

### Produkt löschen

**Vorher:**
```typescript
fetch(`/api/products/${productId}`, {
  method: "DELETE"
})
```

**Jetzt:**
```typescript
fetch(`/api/admin/product?id=${productId}`, {
  method: "DELETE"
})
```

## 🎯 Vorteile

### Image Upload:
✅ **Sofortige DB-Integration** - Kein extra Schritt nötig
✅ **Vollständige Daten** - ID, timestamps, etc. sofort verfügbar
✅ **Frontend-Ready** - Kann direkt im State verwendet werden
✅ **Konsistent** - Gleiche Datenstruktur wie beim Laden

### API-Struktur:
✅ **Einfachere Struktur** - Keine dynamischen Ordner mehr
✅ **Konsistent** - ID immer im gleichen Format (Query oder Body)
✅ **Flexibler** - Einfacher zu erweitern
✅ **RESTful** - Folgt Standard-Konventionen besser

## 📝 Migrations-Checkliste

### Backend: ✅ Fertig
- [x] `/api/admin/product/imageUpload` mit DB-Speicherung
- [x] `/api/admin/product` mit GET/POST/PUT/DELETE
- [x] [id]-Ordner kann entfernt werden (optional)

### Frontend: ⏳ Anzupassen
- [ ] ProductForm: Upload-URL ändern
- [ ] ProductForm: `image`-Objekt statt `url` verarbeiten
- [ ] loadProduct: Query-Parameter statt Path-Parameter
- [ ] updateProduct: ID im Body statt im Path
- [ ] deleteProduct: Query-Parameter statt Path-Parameter

## 🗑️ Alte Dateien (können gelöscht werden)

```
app/api/admin/product/[id]/route.ts  ← Nicht mehr benötigt
app/api/upload/route.ts              ← Falls nicht woanders verwendet
```

## 🐛 Troubleshooting

### Bild wird nicht angezeigt
- Prüfe ob `image.url` korrekt zurückgegeben wird
- Prüfe ob Bild-Datei wirklich gespeichert wurde (Dateisystem)
- Prüfe Netzwerk-Tab für Response

### Upload schlägt fehl
- Prüfe ob `productId` übergeben wird
- Prüfe Dateigröße (max 50MB)
- Prüfe Dateityp (muss image/* sein)
- Prüfe Server-Logs

### Product nicht gefunden
- GET: Prüfe Query-Parameter `?id=123`
- PUT: Prüfe `id` im Body
- DELETE: Prüfe Query-Parameter `?id=123`

