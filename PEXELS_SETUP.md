# Pexels API Setup - Produktbilder

Um hochwertige, passende Bilder für deine Produkte zu bekommen, kannst du die **Pexels API** verwenden.

## 🎯 Warum Pexels?

- ✅ **Kostenlos** - 200 Anfragen pro Stunde
- ✅ **Hochwertige Bilder** - Professionelle Fotos
- ✅ **Keyword-basiert** - Suche nach Produkttyp
- ✅ **Kommerziell nutzbar** - Keine Lizenzprobleme
- ✅ **Höheres Limit** als Unsplash (200 vs 50 Requests/Stunde)

## 📝 Schritt-für-Schritt Anleitung

### 1. Pexels Account erstellen
1. Gehe zu [pexels.com/api](https://www.pexels.com/api/)
2. Klicke auf **"Get Started"**
3. Erstelle einen Account oder logge dich ein

### 2. API Key erhalten
1. Nach dem Login findest du deinen **API Key** direkt im Dashboard
2. Kopiere den Key (sieht aus wie: `abcd1234efgh5678ijkl9012mnop3456`)

### 3. In .env einfügen
Öffne deine `.env` Datei und füge hinzu:

```env
PEXELS_API_KEY=dein_api_key_hier
```

**Beispiel:**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
PEXELS_API_KEY="abcd1234efgh5678ijkl9012mnop3456"
```

## 🚀 Verwendung

### Mit Pexels API (empfohlen):
```bash
npm run db:seed:all:unsplash
```

### Ohne Pexels API (Fallback):
```bash
npm run db:seed:products
```

## 📊 API Limits

**Kostenlose Nutzung:**
- **200 Anfragen pro Stunde**
- Ausreichend für ~40-50 Produkte/Stunde (4 Bilder pro Produkt)
- Kein Antrag nötig

## 🎨 Wie funktioniert die Bildsuche?

Das Script sucht automatisch nach passenden Bildern basierend auf:

### Produktkategorien:
- **Elektronik** → "laptop", "smartphone", "technology"
- **Mode** → "fashion", "clothing", "shoes"
- **Sport** → "sports", "fitness", "exercise"
- etc.

### Produkttypen:
- **Laptop** → "laptop", "computer", "notebook"
- **Sneaker** → "sneakers", "shoes", "footwear"
- **Kaffeemaschine** → "coffee machine", "coffee maker"

## 🔄 Fallback-Optionen

Falls die Pexels API nicht verfügbar ist:

### 1. Picsum Photos (automatischer Fallback)
```typescript
https://picsum.photos/seed/{random}/800/800
```
- ✅ Kostenlos, unbegrenzt
- ❌ Keine Keyword-Suche
- ❌ Zufällige Bilder

### 2. Lokale Bilder
Lege Bilder in `public/products/` und referenziere sie:
```typescript
previewImage: `/products/${category}/${productId}.jpg`
```

## 🛠️ Script anpassen

In `seed-products-unsplash.ts`:

### Mehr Produkte pro Kategorie:
```typescript
const productsPerTemplate = 5; // Ändere diese Zahl
```

### Eigene Keywords hinzufügen:
```typescript
{
  name: 'Laptop',
  keywords: ['laptop', 'macbook', 'thinkpad'] // Füge hinzu
}
```

### Bildqualität ändern:
```typescript
return randomPhoto.src.large; // original, large2x, large, medium, small, portrait, landscape, tiny
```

## ❓ Häufige Probleme

### "Rate limit exceeded"
- Du hast 200 Anfragen/Stunde überschritten
- Warte 1 Stunde oder reduziere `productsPerTemplate`
- Das Script wartet automatisch 2 Sekunden zwischen Requests

### "Invalid API key"
- Prüfe ob der Key richtig in `.env` steht
- Keine Anführungszeichen um den Key
- Key muss von [pexels.com/api](https://www.pexels.com/api/) sein

### Bilder werden nicht geladen
- Pexels API ist optional
- Script läuft auch ohne und nutzt Picsum als Fallback

## 📚 Weitere Infos

- [Pexels API Dokumentation](https://www.pexels.com/api/documentation/)
- [pexels npm package](https://www.npmjs.com/package/pexels)
- [Pexels Lizenz](https://www.pexels.com/license/)

## 🎉 Fertig!

Jetzt kannst du:
```bash
npm run db:seed:all:unsplash
```

Und bekommst ~40-50 Produkte mit **passenden, hochwertigen Bildern**! 🖼️
