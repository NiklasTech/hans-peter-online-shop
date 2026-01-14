import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const order = await prisma.order.findFirst({
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              previewImage: true,
              brand: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.log('Order data:');
  console.log(JSON.stringify(order, null, 2));
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
