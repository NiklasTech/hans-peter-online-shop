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

// Mögliche Bestellstatus
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Mögliche Zahlungsstatus
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

// Mögliche Zahlungsmethoden
const PAYMENT_METHODS = ['Kreditkarte', 'PayPal', 'Rechnung', 'Sofortüberweisung', 'Lastschrift'];

// Mögliche Versandmethoden
const SHIPPING_METHODS = ['DHL Standard', 'DHL Express', 'DPD', 'Hermes', 'UPS'];

// Versandkosten basierend auf Versandart
const SHIPPING_COSTS: Record<string, number> = {
  'DHL Standard': 4.99,
  'DHL Express': 9.99,
  'DPD': 5.49,
  'Hermes': 4.49,
  'UPS': 6.99,
};

// Generiere eine realistische Tracking-Nummer
function generateTrackingNumber(shippingMethod: string): string {
  if (shippingMethod.includes('DHL')) {
    return `${faker.string.numeric(12)}${faker.string.alphanumeric(2).toUpperCase()}`;
  } else if (shippingMethod.includes('DPD')) {
    return `${faker.string.numeric(14)}`;
  } else if (shippingMethod.includes('Hermes')) {
    return `H${faker.string.numeric(13)}`;
  } else if (shippingMethod.includes('UPS')) {
    return `1Z${faker.string.alphanumeric(16).toUpperCase()}`;
  }
  return faker.string.alphanumeric(14).toUpperCase();
}

async function main() {
  console.log('🛒 Starting order seed...\n');

  // Hole alle User (außer Admin)
  const users = await prisma.user.findMany({
    where: { isAdmin: false },
    include: {
      addresses: true,
    },
  });

  if (users.length === 0) {
    console.log('⚠️  Keine User gefunden. Bitte erst seed-users.ts ausführen!');
    console.log('💡 Run: npm run db:seed:users\n');
    return;
  }

  console.log(`👥 Found ${users.length} users for orders\n`);

  // Hole alle Produkte
  const products = await prisma.product.findMany({
    where: {
      stock: {
        gt: 0, // Nur Produkte auf Lager
      },
    },
  });

  if (products.length === 0) {
    console.log('⚠️  Keine Produkte gefunden. Bitte erst seed-products.ts ausführen!');
    console.log('💡 Run: npm run db:seed:products\n');
    return;
  }

  console.log(`📦 Found ${products.length} products in stock\n`);

  let totalOrders = 0;

  // Erstelle für jeden User 1-5 Bestellungen
  for (const user of users) {
    const numOrders = faker.number.int({ min: 1, max: 5 });

    // Überspringe User ohne Adressen
    if (user.addresses.length === 0) {
      console.log(`⚠️  User ${user.name} has no addresses, skipping...`);
      continue;
    }

    for (let i = 0; i < numOrders; i++) {
      // Wähle eine zufällige Adresse des Users
      const address = faker.helpers.arrayElement(user.addresses);

      // Wähle 1-5 zufällige Produkte für die Bestellung
      const numItems = faker.number.int({ min: 1, max: 5 });
      const orderProducts = faker.helpers.arrayElements(products, numItems);

      // Berechne Gesamtpreis
      const orderItems = orderProducts.map((product) => ({
        productId: product.id,
        quantity: faker.number.int({ min: 1, max: 3 }),
        price: product.price,
      }));

      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Wähle Versandmethode und berechne Versandkosten
      const shippingMethod = faker.helpers.arrayElement(SHIPPING_METHODS);
      const shippingCost = SHIPPING_COSTS[shippingMethod];
      const total = subtotal + shippingCost;

      // Wähle Status basierend auf Wahrscheinlichkeiten
      const statusRandom = Math.random();
      let status: string;
      let paymentStatus: string;
      let trackingNumber: string | null = null;

      if (statusRandom < 0.1) {
        // 10% cancelled
        status = 'cancelled';
        paymentStatus = faker.helpers.arrayElement(['failed', 'refunded']);
      } else if (statusRandom < 0.2) {
        // 10% pending
        status = 'pending';
        paymentStatus = 'pending';
      } else if (statusRandom < 0.4) {
        // 20% processing
        status = 'processing';
        paymentStatus = 'paid';
      } else if (statusRandom < 0.7) {
        // 30% shipped
        status = 'shipped';
        paymentStatus = 'paid';
        trackingNumber = generateTrackingNumber(shippingMethod);
      } else {
        // 30% delivered
        status = 'delivered';
        paymentStatus = 'paid';
        trackingNumber = generateTrackingNumber(shippingMethod);
      }

      // Erstelle die Bestellung mit Zeitstempel in der Vergangenheit (letzte 90 Tage)
      const createdAt = faker.date.recent({ days: 90 });
      const updatedAt = new Date(createdAt.getTime() + faker.number.int({ min: 0, max: 7 * 24 * 60 * 60 * 1000 })); // 0-7 Tage nach Erstellung

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          status,
          total,
          paymentStatus,
          paymentMethod: user.defaultPayment || faker.helpers.arrayElement(PAYMENT_METHODS),
          shippingMethod,
          shippingCost,
          trackingNumber,
          createdAt,
          updatedAt,

          // Snapshot der Lieferadresse
          shippingStreet: address.street,
          shippingHouseNumber: address.houseNumber,
          shippingCity: address.city,
          shippingPostalCode: address.postalCode,
          shippingCountryCode: address.countryCode,
          shippingFirstName: address.firstName,
          shippingLastName: address.lastName,
          shippingPhone: address.phone,

          // OrderItems erstellen
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: true,
        },
      });

      totalOrders++;
    }

    console.log(`  ✓ ${user.name}: ${numOrders} ${numOrders === 1 ? 'Bestellung' : 'Bestellungen'} erstellt`);
  }

  console.log(`\n✅ Successfully created ${totalOrders} orders!`);

  // Statistik ausgeben
  const stats = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  });

  console.log('\n📊 Order Statistics:');
  for (const stat of stats) {
    console.log(`  ${stat.status}: ${stat._count} orders`);
  }

  console.log('\n💡 Orders successfully seeded with realistic data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
