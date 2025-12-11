import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('Starting seed...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hanspeter.shop' },
    update: {},
    create: {
      name: 'Admin Hans Peter',
      email: 'admin@hanspeter.shop',
      password: adminPassword,
      isAdmin: true,
    },
  });

  console.log('Created admin user:', admin.email);
  console.log('  - Default password: admin123');
  console.log('  - IMPORTANT: Change this password in production!');

  // Create a brand
  const brand = await prisma.brand.upsert({
    where: { name: 'TechPro' },
    update: {},
    create: {
      name: 'TechPro',
      description: 'Premium technology products',
      image: '/images/brands/techpro.jpg',
    },
  });

  console.log('Created brand:', brand.name);

  // Create a category
  const category = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      image: '/images/categories/electronics.jpg',
    },
  });

  console.log('Created category:', category.name);

  // Create a product
  const product = await prisma.product.create({
    data: {
      name: 'Wireless Gaming Mouse Pro',
      description: 'High-precision wireless gaming mouse with RGB lighting and customizable buttons. Features a 16000 DPI sensor, ergonomic design, and up to 70 hours of battery life.',
      price: 79.99,
      stock: 50,
      brandId: brand.id,
      previewImage: '/images/products/gaming-mouse-1.jpg',
      categories: {
        create: [
          {
            categoryId: category.id,
          },
        ],
      },
      images: {
        create: [
          {
            url: '/images/products/gaming-mouse-1.jpg',
            index: 0,
          },
          {
            url: '/images/products/gaming-mouse-2.jpg',
            index: 1,
          },
          {
            url: '/images/products/gaming-mouse-3.jpg',
            index: 2,
          },
        ],
      },
      details: {
        create: [
          {
            key: 'DPI',
            value: '16000',
          },
          {
            key: 'Connection',
            value: 'Wireless 2.4GHz + Bluetooth',
          },
          {
            key: 'Battery Life',
            value: 'Up to 70 hours',
          },
          {
            key: 'Weight',
            value: '89g',
          },
          {
            key: 'Buttons',
            value: '8 programmable buttons',
          },
          {
            key: 'RGB Lighting',
            value: 'Yes, 16.8 million colors',
          },
        ],
      },
    },
    include: {
      categories: true,
      images: true,
      details: true,
    },
  });

  console.log('Created product:', product.name);
  console.log('  - SKU:', product.sku);
  console.log('  - Price:', product.price);
  console.log('  - Stock:', product.stock);
  console.log('  - Images:', product.images.length);
  console.log('  - Details:', product.details.length);
  console.log('\nSeed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
