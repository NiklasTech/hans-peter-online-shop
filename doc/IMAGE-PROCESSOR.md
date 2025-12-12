# ImageProcessor - Bildverarbeitungsklasse

## 📦 Installation

```bash
npm install sharp
```

## 🎯 Features

- ✅ **Multiple Formate**: JPEG, PNG, WebP, AVIF
- ✅ **Automatische Größenanpassung**: Max-Width/Max-Height mit Aspect Ratio
- ✅ **Transparenz-Handling**: Optional für PNG, WebP, AVIF
- ✅ **Qualitätskontrolle**: Konfigurierbare Qualität pro Format
- ✅ **Hash-basierte Pfadstruktur**: `/[a-f]/[a-f]/[productId]/filename.ext`
- ✅ **Automatische Verzeichniserstellung**
- ✅ **Batch-Verarbeitung**: Mehrere Bilder gleichzeitig
- ✅ **Multi-Version Support**: Erstellt mehrere Formate eines Bildes

## 📚 Verwendung

### Basis-Verwendung

```typescript
import { ImageProcessor } from "@/lib/ImageProcessor";

// Initialisierung
const processor = new ImageProcessor(
  files,                      // File[]
  "public/productImages",     // Basis-Pfad
  123                         // Produkt-ID (optional)
);

// Als JPEG speichern
const jpegPath = await processor.saveAsJpeg(
  file,
  { maxWidth: 1920, maxHeight: 1920 },
  { quality: 85 }
);
// Rückgabe: "/a/3/123/image-name.jpg"
```

### Einzelne Formate

#### JPEG
```typescript
const path = await processor.saveAsJpeg(
  file,
  { maxWidth: 1920, maxHeight: 1920 },
  { quality: 85 }  // default: 85
);
```

#### PNG (mit Transparenz)
```typescript
const path = await processor.saveAsPng(
  file,
  { maxWidth: 1920, maxHeight: 1920 },
  { 
    quality: 85,              // default: 85
    preserveTransparency: true  // default: true
  }
);
```

#### WebP
```typescript
const path = await processor.saveAsWebp(
  file,
  { maxWidth: 1920, maxHeight: 1920 },
  { 
    quality: 85,
    preserveTransparency: true
  }
);
```

#### AVIF
```typescript
const path = await processor.saveAsAvif(
  file,
  { maxWidth: 1920, maxHeight: 1920 },
  { 
    quality: 75,              // default: 75 (AVIF ist effizienter)
    preserveTransparency: true
  }
);
```

### Multiple Versionen erstellen

```typescript
const versions = await processor.createMultipleVersions(
  file,
  ["webp", "jpeg", "avif"],
  { maxWidth: 1920 },
  { quality: 85 }
);

console.log(versions);
// {
//   webp: "/a/3/123/image.webp",
//   jpeg: "/a/3/123/image.jpg",
//   avif: "/a/3/123/image.avif"
// }
```

### Alle Bilder verarbeiten

```typescript
const paths = await processor.processAll(
  "webp",
  { maxWidth: 1920 },
  { quality: 85 }
);

console.log(paths);
// ["/a/3/123/image1.webp", "/b/7/123/image2.webp"]
```

### Weitere Bilder hinzufügen

```typescript
const processor = new ImageProcessor([file1, file2]);

// Später weitere Bilder hinzufügen
processor.addFiles([file3, file4]);

// Produkt-ID setzen (wenn erst später bekannt)
processor.setProductId(123);
```

## 🗂️ Pfadstruktur

```
public/productImages/
├── a/
│   ├── 3/
│   │   └── 123/
│   │       ├── product-image.jpg
│   │       ├── product-image.webp
│   │       └── product-image.avif
│   └── 7/
│       └── 123/
│           └── another-image.jpg
└── b/
    └── f/
        └── 456/
            └── image.png
```

**Pfad-Schema:**
- Erste zwei Zeichen des MD5-Hash als Ordnerstruktur
- Dann Produkt-ID (optional)
- Dann Dateiname mit Extension

**Vorteile:**
- ✅ Gleichmäßige Verteilung der Dateien
- ✅ Vermeidet zu viele Dateien in einem Ordner
- ✅ Einfach zu backupen
- ✅ Skalierbar

## 🔧 API-Integration

### Upload-Route (`/api/upload`)

```typescript
import { ImageProcessor } from "@/lib/ImageProcessor";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const productId = formData.get("productId") as string | null;

  const processor = new ImageProcessor(
    [file],
    "public/productImages",
    productId ? parseInt(productId) : undefined
  );

  // Erstelle mehrere Versionen
  const versions = await processor.createMultipleVersions(
    file,
    ["webp", "jpeg"],
    { maxWidth: 1920, maxHeight: 1920 },
    { quality: 85 }
  );

  // Thumbnail
  const thumbnail = await processor.saveAsWebp(
    file,
    { maxWidth: 400, maxHeight: 400 },
    { quality: 80 }
  );

  return NextResponse.json({
    url: versions.webp || versions.jpeg,
    versions,
    thumbnail,
  });
}
```

### Response Format

```json
{
  "url": "/a/3/123/image.webp",
  "versions": {
    "webp": "/a/3/123/image.webp",
    "jpeg": "/a/3/123/image.jpg"
  },
  "thumbnail": "/a/3/123/image-thumb.webp"
}
```

## 📊 Größen & Qualität

### Empfohlene Einstellungen

#### Produktbilder (Hauptbilder)
```typescript
{
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 85
}
```

#### Thumbnails
```typescript
{
  maxWidth: 400,
  maxHeight: 400,
  quality: 80
}
```

#### Galerie/Grid
```typescript
{
  maxWidth: 800,
  maxHeight: 800,
  quality: 80
}
```

### Format-Vergleich

| Format | Qualität | Dateigröße | Browser-Support | Transparenz |
|--------|----------|------------|-----------------|-------------|
| JPEG   | Gut      | Mittel     | 100%            | ❌          |
| PNG    | Sehr gut | Groß       | 100%            | ✅          |
| WebP   | Sehr gut | Klein      | 97%             | ✅          |
| AVIF   | Exzellent| Sehr klein | 80%             | ✅          |

### Empfehlung

**Standard-Setup:**
```typescript
// Erstelle WebP (modern) + JPEG (Fallback)
const versions = await processor.createMultipleVersions(
  file,
  ["webp", "jpeg"],
  { maxWidth: 1920 },
  { quality: 85 }
);
```

**Premium-Setup:**
```typescript
// Beste Qualität und Kompression
const versions = await processor.createMultipleVersions(
  file,
  ["avif", "webp", "jpeg"],
  { maxWidth: 1920 },
  { quality: 85 }
);
```

## 🎨 Transparenz

### Transparenz beibehalten
```typescript
await processor.saveAsPng(file, {}, {
  preserveTransparency: true  // Standard
});
```

### Transparenz entfernen (weißer Hintergrund)
```typescript
await processor.saveAsJpeg(file, {}, {
  preserveTransparency: false  // Fügt weißen Hintergrund hinzu
});
```

**Hinweis:** JPEG unterstützt keine Transparenz. Transparente Bereiche werden automatisch weiß.

## 🔍 TypeScript Types

```typescript
interface ImageDimensions {
  maxWidth?: number;
  maxHeight?: number;
}

interface ImageQuality {
  quality?: number;
}

interface TransparencyOptions {
  preserveTransparency?: boolean;
}
```

## ⚡ Performance

### Sharp vs. andere Bibliotheken

| Bibliothek | Geschwindigkeit | Qualität | Memory |
|------------|----------------|----------|--------|
| Sharp      | ⚡⚡⚡ Sehr schnell | Exzellent | Niedrig |
| Jimp       | 🐌 Langsam     | Gut      | Hoch   |
| ImageMagick| ⚡⚡ Schnell    | Exzellent| Mittel |

**Sharp-Vorteile:**
- Nutzt libvips (C-Bibliothek)
- Streaming-basiert
- Niedrige Memory-Nutzung
- Sehr schnell bei großen Bildern

## 🐛 Troubleshooting

### Sharp Installation schlägt fehl
```bash
# Rebuild sharp
npm rebuild sharp

# Oder komplett neu installieren
npm uninstall sharp
npm install sharp
```

### Pfad-Fehler
```typescript
// Stelle sicher, dass basePath vom project root aus ist
const processor = new ImageProcessor(
  files,
  "public/productImages",  // ✅ Richtig
  // nicht: "../public/productImages"  // ❌ Falsch
);
```

### Verzeichnis existiert nicht
Die Klasse erstellt automatisch alle benötigten Verzeichnisse.
Falls Fehler: Prüfe Schreibrechte für `public/` Ordner.

### Speicher-Fehler bei vielen Bildern
```typescript
// Batch-Verarbeitung in Chunks
const chunks = chunkArray(files, 5);  // 5 Bilder gleichzeitig

for (const chunk of chunks) {
  const processor = new ImageProcessor(chunk);
  await processor.processAll("webp");
}
```

## 📝 Beispiel: Integration im Backend

```typescript
// app/api/products/route.ts
import { ImageProcessor } from "@/lib/ImageProcessor";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("images") as File[];
  
  // Erstelle Produkt in DB
  const product = await db.product.create({
    data: { /* ... */ }
  });

  // Verarbeite Bilder mit Produkt-ID
  const processor = new ImageProcessor(
    files,
    "public/productImages",
    product.id
  );

  // Erstelle optimierte Versionen
  const imagePaths: string[] = [];
  
  for (const file of files) {
    const versions = await processor.createMultipleVersions(
      file,
      ["webp", "jpeg"],
      { maxWidth: 1920 },
      { quality: 85 }
    );
    
    imagePaths.push(versions.webp || versions.jpeg);
  }

  // Speichere Pfade in DB
  await db.productImage.createMany({
    data: imagePaths.map((url, index) => ({
      productId: product.id,
      url,
      index,
    })),
  });

  return NextResponse.json({ product });
}
```

## 🎉 Fertig!

Die `ImageProcessor`-Klasse ist jetzt vollständig in dein Backend integriert und verarbeitet automatisch alle hochgeladenen Bilder!

