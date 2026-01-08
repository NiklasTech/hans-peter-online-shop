import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker/locale/de';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Kategorien für den Shop
const CATEGORIES = [
  { name: 'Elektronik', description: 'Smartphones, Tablets, Computer und mehr' },
  { name: 'Mode', description: 'Kleidung, Schuhe und Accessoires' },
  { name: 'Haushalt', description: 'Küche, Bad und Wohnzimmer' },
  { name: 'Sport', description: 'Sportgeräte und Fitness' },
  { name: 'Bücher', description: 'Romane, Sachbücher und mehr' },
  { name: 'Spielzeug', description: 'Spielzeug für Kinder jeden Alters' },
  { name: 'Garten', description: 'Gartengeräte und Pflanzen' },
  { name: 'Automobile', description: 'Autozubehör und Werkzeug' },
  { name: 'Beauty', description: 'Kosmetik und Pflegeprodukte' },
  { name: 'Lebensmittel', description: 'Lebensmittel und Getränke' },
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

// Produktvorlagen nach Kategorie
const PRODUCT_TEMPLATES = {
  Elektronik: [
    'Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Tastatur', 'Maus', 'Headset',
    'Webcam', 'Drucker', 'Scanner', 'Router', 'Powerbank', 'USB-Stick', 'Festplatte',
    'SSD', 'RAM', 'Grafikkarte', 'Prozessor', 'Mainboard', 'Netzteil',
  ],
  Mode: [
    'T-Shirt', 'Hemd', 'Hose', 'Jeans', 'Jacke', 'Pullover', 'Kleid', 'Rock',
    'Schuhe', 'Sneaker', 'Stiefel', 'Sandalen', 'Gürtel', 'Tasche', 'Rucksack',
  ],
  Haushalt: [
    'Kaffeemaschine', 'Wasserkocher', 'Toaster', 'Mixer', 'Staubsauger', 'Bügeleisen',
    'Mikrowelle', 'Kühlschrank', 'Waschmaschine', 'Geschirrspüler', 'Lampe', 'Tisch',
    'Stuhl', 'Sofa', 'Bett', 'Schrank', 'Regal',
  ],
  Sport: [
    'Laufschuhe', 'Yogamatte', 'Hanteln', 'Fitnessband', 'Springseil', 'Basketball',
    'Fußball', 'Tennis-Schläger', 'Fahrrad', 'Helm', 'Trinkflasche', 'Sporttasche',
  ],
  Bücher: [
    'Roman', 'Krimi', 'Thriller', 'Fantasy', 'Sachbuch', 'Biografie', 'Kochbuch',
    'Reiseführer', 'Kinderbuch', 'Comic', 'Manga',
  ],
  Spielzeug: [
    'Puppe', 'Actionfigur', 'Puzzle', 'Brettspiel', 'Kartenspiel', 'Bauklötze',
    'Ferngesteuertes Auto', 'Drohne', 'Kuscheltier', 'Spielzeugauto',
  ],
  Garten: [
    'Rasenmäher', 'Gartenschere', 'Schlauch', 'Gießkanne', 'Blumentopf', 'Pflanzenerde',
    'Dünger', 'Gartenmöbel', 'Sonnenschirm', 'Grillgerät',
  ],
  Automobile: [
    'Motoröl', 'Scheibenwischer', 'Lufterfrischer', 'Fußmatten', 'Werkzeugset',
    'Starthilfekabel', 'Handyhalterung', 'Dashcam', 'Felgen', 'Reifen',
  ],
  Beauty: [
    'Shampoo', 'Conditioner', 'Gesichtscreme', 'Bodylotion', 'Parfüm', 'Lippenstift',
    'Mascara', 'Foundation', 'Nagellack', 'Haarbürste', 'Föhn',
  ],
  Lebensmittel: [
    'Kaffee', 'Tee', 'Müsli', 'Pasta', 'Reis', 'Olivenöl', 'Gewürze', 'Schokolade',
    'Chips', 'Getränke', 'Honig', 'Marmelade',
  ],
};

async function main() {
  console.log('🌱 Starting product seed...\n');

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
    categories.push(category);
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
  console.log('\n📦 Creating products...');
  let totalProducts = 0;

  for (const category of categories) {
    const templates = PRODUCT_TEMPLATES[category.name as keyof typeof PRODUCT_TEMPLATES] || [];
    const productsPerTemplate = 3; // Pro Template mehrere Varianten

    for (const template of templates) {
      for (let i = 0; i < productsPerTemplate; i++) {
        const brand = faker.helpers.arrayElement(brands);
        const basePrice = faker.number.float({ min: 9.99, max: 999.99, fractionDigits: 2 });

        // Produktname mit Variationen
        const adjectives = ['Premium', 'Deluxe', 'Pro', 'Plus', 'Ultra', 'Basic', 'Classic', 'Modern'];
        const colors = ['Schwarz', 'Weiß', 'Rot', 'Blau', 'Grün', 'Grau', 'Silber', 'Gold'];
        const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

        let productName = `${brand.name} ${template}`;

        // Manchmal Adjektiv hinzufügen
        if (faker.datatype.boolean()) {
          productName = `${brand.name} ${faker.helpers.arrayElement(adjectives)} ${template}`;
        }

        // Für Mode: Größe hinzufügen
        if (category.name === 'Mode') {
          productName += ` (${faker.helpers.arrayElement(sizes)})`;
        }

        // Für Elektronik/Haushalt: Farbe hinzufügen
        if (['Elektronik', 'Haushalt', 'Sport'].includes(category.name) && faker.datatype.boolean()) {
          productName += ` - ${faker.helpers.arrayElement(colors)}`;
        }

        const product = await prisma.product.create({
          data: {
            name: productName,
            description: faker.commerce.productDescription(),
            price: basePrice,
            stock: faker.number.int({ min: 0, max: 100 }),
            brandId: brand.id,
            previewImage: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/400/400`,
            categories: {
              create: {
                categoryId: category.id,
              },
            },
            images: {
              create: [
                { url: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/800`, index: 0 },
                { url: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/800`, index: 1 },
                { url: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/800`, index: 2 },
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

        // Fortschritt anzeigen
        if (totalProducts % 20 === 0) {
          console.log(`  ✓ Created ${totalProducts} products...`);
        }
      }
    }
  }

  console.log(`\n✅ Successfully created ${totalProducts} products!`);
  console.log(`📁 Categories: ${categories.length}`);
  console.log(`🏷️  Brands: ${brands.length}`);

  console.log('\n💡 You can now browse your shop with realistic data!');
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
