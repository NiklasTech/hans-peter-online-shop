import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkProducts() {
  const products = await prisma.product.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      previewImage: true,
      price: true
    }
  });

  console.log(`\n📦 Gefunden: ${products.length} Produkte\n`);

  products.forEach(p => {
    console.log(`- ${p.name}`);
    console.log(`  Preis: €${p.price}`);
    console.log(`  Bild: ${p.previewImage?.substring(0, 50)}...`);
    console.log();
  });

  await pool.end();
  await prisma.$disconnect();
}

checkProducts();
