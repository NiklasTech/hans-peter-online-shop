# ProductForm Updates - Autocomplete & Many-to-Many Categories

## 🎯 Implementierte Features

### 1. **Many-to-Many Beziehung für Categories**
- Products können jetzt mehreren Kategorien zugeordnet werden
- Neue `ProductCategory` Zwischentabelle erstellt
- Migration: `20251128092400_category_many_to_many`

### 2. **Autocomplete Combobox Komponenten**
- **Combobox**: Single-Select mit Suchfunktion (für Brands)
- **MultiCombobox**: Multi-Select mit Suchfunktion (für Categories)
- Beide unterstützen das Erstellen neuer Einträge beim Tippen

### 3. **Automatisches Erstellen von Categories & Brands**
- Beim Eingeben eines neuen Namens wird ein "Erstellen"-Button angezeigt
- Neue Categories/Brands werden automatisch zur Datenbank hinzugefügt
- Nach dem Erstellen werden sie automatisch ausgewählt

## 📦 Neue Komponenten

### `components/ui/combobox.tsx`
```typescript
// Single-Select Combobox
<Combobox
  options={brands.map(b => ({ value: b.id.toString(), label: b.name }))}
  value={brandId}
  onValueChange={setBrandId}
  placeholder="Marke wählen"
  allowCreate
  onCreate={handleCreateBrand}
/>

// Multi-Select Combobox
<MultiCombobox
  options={categories.map(c => ({ value: c.id.toString(), label: c.name }))}
  values={categoryIds}
  onValuesChange={setCategoryIds}
  placeholder="Kategorien wählen"
  allowCreate
  onCreate={handleCreateCategory}
/>
```

### `components/ui/command.tsx`
Command-Komponente basierend auf `cmdk` für Tastaturnavigation und Suche.

## 🗄️ Datenbankänderungen

### Schema Updates

**Vorher:**
```prisma
model Product {
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id])
}

model Category {
  products Product[]
}
```

**Nachher:**
```prisma
model Product {
  categories ProductCategory[]
}

model Category {
  products ProductCategory[]
}

model ProductCategory {
  productId  Int
  categoryId Int
  product    Product  @relation(fields: [productId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])
  
  @@id([productId, categoryId])
}
```

## 🔧 API-Änderungen

### POST `/api/admin/products`
**Request Body:**
```json
{
  "name": "Product Name",
  "categoryIds": [1, 2, 3],  // Array statt einzelner categoryId
  "brandId": 1,
  "price": 99.99,
  "stock": 100
}
```

### PUT `/api/admin/products/[id]`
**Request Body:**
```json
{
  "categoryIds": [1, 2, 3],  // Überschreibt alle Categories
  "brandId": 1
}
```

### Response Format
```json
{
  "product": {
    "id": 1,
    "name": "Product",
    "brandId": 1,
    "categories": [
      { "categoryId": 1, "category": { "id": 1, "name": "Elektronik" } },
      { "categoryId": 2, "category": { "id": 2, "name": "Zubehör" } }
    ],
    "brand": { "id": 1, "name": "TechPro" }
  }
}
```

## 📝 TypeScript Types

### Updated Product Interface
```typescript
export interface Product {
  id: number;
  name: string;
  brandId: number;
  categories?: { categoryId: number }[];
  // categoryId entfernt
}

export interface CreateProductInput {
  name: string;
  categoryIds: number[];  // Array statt einzelner ID
  brandId: number;
  price: number;
  stock: number;
}
```

## 🚀 Verwendung in ProductForm

### ProductForm State
```typescript
const [categoryIds, setCategoryIds] = useState<string[]>([]);  // Array
const [brandId, setBrandId] = useState("");

const [categories, setCategories] = useState<Category[]>([]);
const [brands, setBrands] = useState<Brand[]>([]);
```

### Handler für neue Einträge
```typescript
const handleCreateCategory = async (name: string) => {
  const response = await fetch("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  
  if (response.ok) {
    const { category } = await response.json();
    setCategories(prev => [...prev, category]);
    setCategoryIds(prev => [...prev, category.id.toString()]);
  }
};
```

## 📦 Installierte Pakete

```bash
npm install cmdk @radix-ui/react-icons
```

## 🔄 Migrations durchführen

```bash
npx prisma migrate dev --name category-many-to-many
npx prisma generate
```

## ✅ Validierung

### ProductForm Validierung
- Name: erforderlich
- Preis: erforderlich, muss positiv sein
- Stock: erforderlich, muss positiv sein
- **Categories: mindestens eine erforderlich** (neu)
- Brand: erforderlich

## 🎨 UI Features

### Category Multi-Select
- Zeigt Badge für jede ausgewählte Kategorie
- X-Button zum Entfernen einzelner Kategorien
- Counter zeigt Anzahl ausgewählter Kategorien
- Suchfunktion filtert verfügbare Optionen
- "Erstellen"-Button bei neuer Eingabe

### Brand Single-Select
- Dropdown mit Suchfunktion
- Zeigt ausgewählte Marke im Trigger
- "Erstellen"-Button bei neuer Eingabe

## 🐛 Troubleshooting

### TypeScript-Fehler nach Installation
```bash
# Cache löschen und neu starten
Remove-Item -Recurse -Force .next
npm run dev
```

### Prisma Client Fehler
```bash
# Client neu generieren
npx prisma generate
```

### Alte Daten migrieren
Falls du bereits Produkte mit der alten 1:n-Beziehung hast, werden diese durch die Migration automatisch in die Zwischentabelle übertragen.

## 📚 Weitere Informationen

- [cmdk Documentation](https://cmdk.paco.me/)
- [Radix UI Command](https://www.radix-ui.com/primitives/docs/components/command)
- [Prisma Many-to-Many Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations)

