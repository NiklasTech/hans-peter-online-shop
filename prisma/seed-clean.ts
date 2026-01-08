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
  console.log('🗑️  Starting database cleanup...\n');

  try {
    // Lösche in der richtigen Reihenfolge (wegen Foreign Keys)
    console.log('Deleting order items...');
    await prisma.orderItem.deleteMany({});

    console.log('Deleting orders...');
    await prisma.order.deleteMany({});

    console.log('Deleting cart items...');
    await prisma.cartItem.deleteMany({});

    console.log('Deleting wishlist items...');
    await prisma.wishlistItem.deleteMany({});

    console.log('Deleting wishlists...');
    await prisma.wishlist.deleteMany({});

    console.log('Deleting reviews...');
    await prisma.review.deleteMany({});

    console.log('Deleting product images...');
    await prisma.productImage.deleteMany({});

    console.log('Deleting product details...');
    await prisma.productDetail.deleteMany({});

    console.log('Deleting product categories...');
    await prisma.productCategory.deleteMany({});

    console.log('Deleting products...');
    await prisma.product.deleteMany({});

    console.log('Deleting categories...');
    await prisma.category.deleteMany({});

    console.log('Deleting brands...');
    await prisma.brand.deleteMany({});

    console.log('Deleting addresses...');
    await prisma.address.deleteMany({});

    console.log('Deleting admin sessions...');
    await prisma.adminSession.deleteMany({});

    console.log('Deleting support chat messages...');
    await prisma.chatMessage.deleteMany({});

    console.log('Deleting support chats...');
    await prisma.supportChat.deleteMany({});

    console.log('Deleting users...');
    await prisma.user.deleteMany({});

    console.log('\n✅ Database cleaned successfully!');
    console.log('💡 You can now run: npm run db:seed:all:unsplash');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
