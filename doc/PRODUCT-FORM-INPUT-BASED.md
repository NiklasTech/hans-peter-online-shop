# ProductForm - Input-basierte Category & Brand Eingabe

## 🎯 Änderungen

Die ProductForm wurde komplett überarbeitet, um eine intuitivere Eingabe zu ermöglichen:

### ✅ **Kategorien-Eingabe** (wie Produkt-Details)
- **Input-Felder** statt Dropdown-Buttons
- **Dynamische Zeilen**: Automatisch neue Zeile beim Tippen
- **Autocomplete**: Vorschläge während der Eingabe
- **Automatisches Erstellen**: Neue Kategorien werden beim Verlassen des Feldes erstellt

### ✅ **Marken-Eingabe**
- **Input-Feld** statt Button
- **Autocomplete**: Vorschläge während der Eingabe
- **Automatisches Erstellen**: Neue Marke wird beim Verlassen des Feldes erstellt

## 📝 Implementierung

### State-Struktur

```typescript
// Categories als Array von Rows (wie Details)
interface CategoryRow {
  id: string;          // Eindeutige Row-ID
  name: string;        // Eingegebener Name
  categoryId?: number; // ID wenn Kategorie existiert
}

const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);

// Brand als String + ID
const [brandName, setBrandName] = useState("");
const [brandId, setBrandId] = useState<number | null>(null);
```

### Kategorien-Eingabe

```typescript
// Handler für Category-Input
const updateCategoryRow = (id: string, value: string) => {
  // Suche nach existierender Kategorie
  const existingCategory = categories.find(
    (cat) => cat.name.toLowerCase() === value.toLowerCase()
  );
  
  setCategoryRows((prev) =>
    prev.map((row) =>
      row.id === id ? { ...row, name: value, categoryId: existingCategory?.id } : row
    )
  );

  // Neue Zeile hinzufügen wenn letzte Zeile bearbeitet wird
  const rowIndex = categoryRows.findIndex((r) => r.id === id);
  if (rowIndex === categoryRows.length - 1 && value.trim() !== "") {
    setCategoryRows((prev) => [...prev, { id: crypto.randomUUID(), name: "" }]);
  }
};

// Automatisches Erstellen beim Blur
const handleCategoryBlur = async (id: string, value: string) => {
  if (!value.trim()) return;
  
  const row = categoryRows.find((r) => r.id === id);
  if (!row?.categoryId) {
    await handleCreateCategory(value.trim(), id);
  }
};
```

### Marken-Eingabe

```typescript
// Handler für Brand-Input
const handleBrandChange = (value: string) => {
  setBrandName(value);
  
  const existingBrand = brands.find(
    (b) => b.name.toLowerCase() === value.toLowerCase()
  );
  
  if (existingBrand) {
    setBrandId(existingBrand.id);
  } else {
    setBrandId(null);
  }
};

// Automatisches Erstellen beim Blur
const handleBrandBlur = async () => {
  if (!brandName.trim()) return;
  
  if (!brandId) {
    await handleCreateBrand(brandName.trim());
  }
};
```

## 🎨 UI-Komponenten

### Kategorien-Input mit Autocomplete

```tsx
<div className="space-y-2">
  {categoryRows.map((row) => (
    <div key={row.id} className="flex gap-2 relative">
      <div className="flex-1 relative">
        <Input
          value={row.name}
          onChange={(e) => updateCategoryRow(row.id, e.target.value)}
          onFocus={() => setCategoryInputFocus(row.id)}
          onBlur={() => handleCategoryBlur(row.id, row.name)}
          placeholder="Kategorie eingeben"
        />
        {/* Autocomplete Dropdown */}
        {categoryInputFocus === row.id && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {getCategorySuggestions(row.name).map((category) => (
              <div
                key={category.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => updateCategoryRow(row.id, category.name)}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* X-Button zum Entfernen */}
      <Button onClick={() => removeCategoryRow(row.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  ))}
</div>
```

### Marken-Input mit Autocomplete

```tsx
<div className="relative">
  <Input
    value={brandName}
    onChange={(e) => handleBrandChange(e.target.value)}
    onFocus={() => setBrandInputFocus(true)}
    onBlur={handleBrandBlur}
    placeholder="Marke eingeben oder auswählen"
  />
  {/* Autocomplete Dropdown */}
  {brandInputFocus && (
    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
      {getBrandSuggestions().map((brand) => (
        <div
          key={brand.id}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          onMouseDown={() => {
            setBrandName(brand.name);
            setBrandId(brand.id);
          }}
        >
          {brand.name}
        </div>
      ))}
    </div>
  )}
</div>
```

## 🔄 Workflow

### Neue Kategorie hinzufügen
1. Tippe den Namen in ein leeres Feld
2. Autocomplete zeigt passende Vorschläge
3. Klicke auf einen Vorschlag ODER tippe weiter
4. Beim Verlassen des Feldes wird die neue Kategorie erstellt
5. Automatisch neue leere Zeile erscheint

### Kategorie löschen
1. Klicke auf das X neben der Zeile
2. Zeile wird entfernt (mindestens eine leere Zeile bleibt)

### Marke auswählen/erstellen
1. Tippe den Namen ins Feld
2. Autocomplete zeigt passende Vorschläge
3. Klicke auf einen Vorschlag ODER tippe weiter
4. Beim Verlassen des Feldes wird die neue Marke erstellt

## ✅ Validierung

```typescript
// Beim Absenden
const validCategories = categoryRows.filter(
  (row) => row.name.trim() && row.categoryId
);

if (validCategories.length === 0) {
  throw new Error("Mindestens eine Kategorie ist erforderlich");
}

if (!brandId) {
  throw new Error("Marke ist erforderlich");
}
```

## 📦 Daten beim Absenden

```typescript
const productData = {
  categoryIds: validCategories.map((row) => row.categoryId!),
  brandId: brandId,
  // ... andere Felder
};
```

## 🎯 Vorteile

### Gegenüber Dropdown/Combobox:
✅ **Schnellere Eingabe** - Direkt tippen statt Dropdown öffnen
✅ **Mehrere Kategorien** - Dynamische Zeilen wie bei Details
✅ **Konsistentes UI** - Gleicher Stil wie Produkt-Details
✅ **Bessere UX** - Autocomplete während der Eingabe
✅ **Automatisches Erstellen** - Keine extra Buttons nötig
✅ **Keyboard-freundlich** - Tab/Enter Navigation

## 🐛 Troubleshooting

### Autocomplete schließt zu früh
- `setTimeout` in `onBlur` verhindert Schließen vor dem Click
- 200ms Verzögerung gibt Zeit für `onMouseDown`

### Kategorie wird nicht erstellt
- Prüfe ob `handleCategoryBlur` aufgerufen wird
- Prüfe Netzwerk-Tab für API-Fehler
- Prüfe ob Category-Name eindeutig ist

### Brand wird nicht gesetzt
- Prüfe ob `handleBrandBlur` aufgerufen wird
- Prüfe ob `brandId` gesetzt wird
- Validierung erfordert `brandId`, nicht nur `brandName`

## 📚 Entfernte Abhängigkeiten

- ❌ `components/ui/combobox.tsx` - Nicht mehr benötigt
- ❌ `components/ui/command.tsx` - Nicht mehr benötigt
- ❌ `cmdk` Package - Kann deinstalliert werden
- ❌ `@radix-ui/react-icons` - Kann deinstalliert werden

Optional aufräumen:
```bash
npm uninstall cmdk @radix-ui/react-icons
```

