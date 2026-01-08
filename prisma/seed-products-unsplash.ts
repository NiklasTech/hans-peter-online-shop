import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker/locale/de';
import { createClient } from 'pexels';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Pexels API initialisieren (optional - funktioniert auch ohne API Key mit Placeholder)
const pexels = process.env.PEXELS_API_KEY
  ? createClient(process.env.PEXELS_API_KEY)
  : null;

// Kategorien für den Shop
const CATEGORIES = [
  { name: 'Elektronik', description: 'Smartphones, Tablets, Computer und mehr', keywords: ['laptop', 'smartphone', 'technology', 'electronics'] },
  { name: 'Mode', description: 'Kleidung, Schuhe und Accessoires', keywords: ['fashion', 'clothing', 'shoes', 'accessories'] },
  { name: 'Haushalt', description: 'Küche, Bad und Wohnzimmer', keywords: ['furniture', 'kitchen', 'home', 'interior'] },
  { name: 'Sport', description: 'Sportgeräte und Fitness', keywords: ['sports', 'fitness', 'exercise', 'gym'] },
  { name: 'Bücher', description: 'Romane, Sachbücher und mehr', keywords: ['books', 'reading', 'library'] },
  { name: 'Spielzeug', description: 'Spielzeug für Kinder jeden Alters', keywords: ['toys', 'kids', 'play', 'children'] },
  { name: 'Garten', description: 'Gartengeräte und Pflanzen', keywords: ['garden', 'plants', 'outdoor', 'flowers'] },
  { name: 'Automobile', description: 'Autozubehör und Werkzeug', keywords: ['car', 'automotive', 'vehicle', 'tools'] },
  { name: 'Beauty', description: 'Kosmetik und Pflegeprodukte', keywords: ['beauty', 'cosmetics', 'skincare', 'makeup'] },
  { name: 'Lebensmittel', description: 'Lebensmittel und Getränke', keywords: ['food', 'coffee', 'drinks', 'grocery'] },
];

// Marken für verschiedene Kategorien
const BRANDS = [
  // Elektronik
  'NVIDIA', 'AMD', 'Intel', 'ASUS', 'MSI', 'Samsung', 'Apple', 'Sony', 'LG', 'Logitech',
  // Mode
  'Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Tommy Hilfiger', 'Levis', 'Calvin Klein',
  // Haushalt
  'IKEA', 'Bosch', 'Siemens', 'Philips', 'WMF', 'Villeroy & Boch',
  // Sport
  'Decathlon', 'Under Armour', 'Reebok', 'Wilson', 'Spalding',
  // Andere
  'Ravensburger', 'LEGO', 'Playmobil', 'Gardena', 'Bosch', 'L\'Oréal', 'Nivea',
];

// Produktvorlagen nach Kategorie mit Suchbegriffen
const PRODUCT_TEMPLATES: Record<string, { name: string; keywords: string[] }[]> = {
  Elektronik: [
    { name: 'Laptop', keywords: ['laptop', 'computer', 'notebook'] },
    { name: 'Smartphone', keywords: ['smartphone', 'phone', 'mobile'] },
    { name: 'Tablet', keywords: ['tablet', 'ipad'] },
    { name: 'Monitor', keywords: ['monitor', 'screen', 'display'] },
    { name: 'Tastatur', keywords: ['keyboard', 'typing'] },
    { name: 'Maus', keywords: ['mouse', 'computer mouse'] },
    { name: 'Headset', keywords: ['headphones', 'headset', 'audio'] },
    { name: 'Webcam', keywords: ['webcam', 'camera'] },
    { name: 'Drucker', keywords: ['printer', 'office'] },
    { name: 'Router', keywords: ['router', 'wifi', 'network'] },
  ],
  Mode: [
    { name: 'T-Shirt', keywords: ['tshirt', 'clothing', 'fashion'] },
    { name: 'Hemd', keywords: ['shirt', 'dress shirt'] },
    { name: 'Jeans', keywords: ['jeans', 'denim', 'pants'] },
    { name: 'Jacke', keywords: ['jacket', 'coat'] },
    { name: 'Sneaker', keywords: ['sneakers', 'shoes', 'footwear'] },
    { name: 'Stiefel', keywords: ['boots', 'shoes'] },
    { name: 'Tasche', keywords: ['bag', 'handbag', 'purse'] },
    { name: 'Rucksack', keywords: ['backpack', 'bag'] },
  ],
  Haushalt: [
    { name: 'Kaffeemaschine', keywords: ['coffee machine', 'coffee maker'] },
    { name: 'Wasserkocher', keywords: ['kettle', 'kitchen'] },
    { name: 'Staubsauger', keywords: ['vacuum cleaner', 'cleaning'] },
    { name: 'Sofa', keywords: ['sofa', 'couch', 'furniture'] },
    { name: 'Tisch', keywords: ['table', 'dining table', 'furniture'] },
    { name: 'Stuhl', keywords: ['chair', 'furniture'] },
    { name: 'Lampe', keywords: ['lamp', 'light', 'lighting'] },
  ],
  Sport: [
    { name: 'Laufschuhe', keywords: ['running shoes', 'sneakers', 'sports'] },
    { name: 'Yogamatte', keywords: ['yoga mat', 'exercise', 'fitness'] },
    { name: 'Hanteln', keywords: ['dumbbells', 'weights', 'fitness'] },
    { name: 'Basketball', keywords: ['basketball', 'sports', 'ball'] },
    { name: 'Fußball', keywords: ['soccer ball', 'football', 'sports'] },
    { name: 'Fahrrad', keywords: ['bicycle', 'bike', 'cycling'] },
  ],
  Bücher: [
    { name: 'Roman', keywords: ['book', 'novel', 'reading'] },
    { name: 'Krimi', keywords: ['book', 'thriller', 'reading'] },
    { name: 'Kochbuch', keywords: ['cookbook', 'recipe book'] },
  ],
  Spielzeug: [
    { name: 'Puzzle', keywords: ['puzzle', 'jigsaw'] },
    { name: 'Brettspiel', keywords: ['board game', 'game'] },
    { name: 'Bauklötze', keywords: ['building blocks', 'lego', 'toys'] },
    { name: 'Kuscheltier', keywords: ['teddy bear', 'plush toy'] },
  ],
  Garten: [
    { name: 'Rasenmäher', keywords: ['lawn mower', 'garden', 'grass'] },
    { name: 'Gartenschere', keywords: ['pruning shears', 'garden tools'] },
    { name: 'Blumentopf', keywords: ['flower pot', 'plant pot'] },
    { name: 'Gartenmöbel', keywords: ['garden furniture', 'outdoor furniture'] },
  ],
  Automobile: [
    { name: 'Motoröl', keywords: ['motor oil', 'car', 'automotive'] },
    { name: 'Werkzeugset', keywords: ['tool set', 'tools', 'wrench'] },
    { name: 'Dashcam', keywords: ['dashcam', 'car camera'] },
  ],
  Beauty: [
    { name: 'Shampoo', keywords: ['shampoo', 'haircare', 'beauty'] },
    { name: 'Gesichtscreme', keywords: ['face cream', 'skincare', 'beauty'] },
    { name: 'Parfüm', keywords: ['perfume', 'fragrance', 'beauty'] },
    { name: 'Lippenstift', keywords: ['lipstick', 'makeup', 'beauty'] },
  ],
  Lebensmittel: [
    { name: 'Kaffee', keywords: ['coffee', 'beans', 'beverage'] },
    { name: 'Tee', keywords: ['tea', 'beverage'] },
    { name: 'Schokolade', keywords: ['chocolate', 'candy', 'sweet'] },
    { name: 'Olivenöl', keywords: ['olive oil', 'cooking'] },
  ],
};

// Funktion zum Abrufen eines Pexels-Bildes
async function getPexelsImage(keywords: string[]): Promise<string> {
  if (!pexels) {
    // Fallback auf Picsum wenn kein API Key vorhanden
    return `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/800`;
  }

  try {
    const query = keywords[Math.floor(Math.random() * keywords.length)];
    const result = await pexels.photos.search({
      query,
      per_page: 30,
      orientation: 'square',
    });

    if ('photos' in result && result.photos.length > 0) {
      const randomPhoto = faker.helpers.arrayElement(result.photos);
      return randomPhoto.src.large;
    }
  } catch (error) {
    console.error('Pexels API error:', error);
  }

  // Fallback
  return `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/800`;
}

// Rate limiting für Pexels API
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🌱 Starting product seed with images...\n');

  if (pexels) {
    console.log('✅ Pexels API aktiv - hochwertige Bilder werden geladen');
    console.log('📊 Limit: 200 Requests/Stunde\n');
  } else {
    console.log('⚠️  Kein Pexels API Key - verwende Placeholder-Bilder');
    console.log('💡 Füge PEXELS_API_KEY in .env hinzu für bessere Bilder\n');
  }

  // Kategorien erstellen
  console.log('📁 Creating categories...');
  const categories = [];
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
    categories.push({ ...category, keywords: cat.keywords });
    console.log(`  ✓ ${category.name}`);
  }

  // Marken erstellen
  console.log('\n🏷️  Creating brands...');
  const brands = [];
  for (const brandName of BRANDS) {
    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: {
        name: brandName,
        description: `${brandName} Produkte`,
      },
    });
    brands.push(brand);
  }
  console.log(`  ✓ Created ${brands.length} brands`);

  // Produkte erstellen
  console.log('\n📦 Creating products with images...');
  let totalProducts = 0;

  for (const category of categories) {
    const templates = PRODUCT_TEMPLATES[category.name] || [];
    const productsPerTemplate = 1; // Nur 1 Produkt pro Template wegen API-Limits (50/Stunde)

    console.log(`\n  📂 ${category.name}:`);

    for (const template of templates) {
      for (let i = 0; i < productsPerTemplate; i++) {
        const brand = faker.helpers.arrayElement(brands);
        const basePrice = faker.number.float({ min: 9.99, max: 999.99, fractionDigits: 2 });

        // Produktname mit Variationen
        const adjectives = ['Premium', 'Deluxe', 'Pro', 'Plus', 'Ultra', 'Basic', 'Classic', 'Modern'];
        const colors = ['Schwarz', 'Weiß', 'Rot', 'Blau', 'Grün', 'Grau', 'Silber', 'Gold'];

        let productName = `${brand.name} ${template.name}`;

        if (faker.datatype.boolean()) {
          productName = `${brand.name} ${faker.helpers.arrayElement(adjectives)} ${template.name}`;
        }

        if (['Elektronik', 'Haushalt'].includes(category.name) && faker.datatype.boolean()) {
          productName += ` - ${faker.helpers.arrayElement(colors)}`;
        }

        // Bilder mit passenden Keywords abrufen
        const keywords = [...template.keywords, ...category.keywords];
        const previewImage = await getPexelsImage(keywords);

        // Kurze Pause um API-Limits zu respektieren (200/Stunde = ~2 Sekunden zwischen Requests)
        if (pexels) await delay(2000);

        const image1 = await getPexelsImage(keywords);
        if (pexels) await delay(2000);

        const image2 = await getPexelsImage(keywords);
        if (pexels) await delay(2000);

        const image3 = await getPexelsImage(keywords);

        // Prüfe ob Produkt bereits existiert (basierend auf name + brandId)
        const existingProduct = await prisma.product.findUnique({
          where: {
            name_brandId: {
              name: productName,
              brandId: brand.id,
            },
          },
        });

        if (existingProduct) {
          console.log(`    ⏭️  Überspringe: ${productName.substring(0, 50)}... (existiert bereits)`);
          continue;
        }

        const product = await prisma.product.create({
          data: {
            name: productName,
            description: faker.commerce.productDescription(),
            price: basePrice,
            stock: faker.number.int({ min: 0, max: 100 }),
            brandId: brand.id,
            previewImage: previewImage,
            categories: {
              create: {
                categoryId: category.id,
              },
            },
            images: {
              create: [
                { url: image1, index: 0 },
                { url: image2, index: 1 },
                { url: image3, index: 2 },
              ],
            },
            details: {
              create: [
                { key: 'Marke', value: brand.name },
                { key: 'Verfügbarkeit', value: 'Auf Lager' },
                { key: 'Lieferzeit', value: '1-3 Werktage' },
                { key: 'Gewicht', value: `${faker.number.float({ min: 0.1, max: 10, fractionDigits: 1 })} kg` },
                { key: 'Material', value: faker.helpers.arrayElement(['Kunststoff', 'Metall', 'Holz', 'Textil', 'Glas']) },
              ],
            },
          },
        });

        totalProducts++;
        console.log(`    ✓ ${productName.substring(0, 50)}...`);
      }
    }
  }

  console.log(`\n✅ Successfully created ${totalProducts} products with images!`);
  console.log(`📁 Categories: ${categories.length}`);
  console.log(`🏷️  Brands: ${brands.length}`);
  console.log('\n💡 Your shop is now ready with realistic product images!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
