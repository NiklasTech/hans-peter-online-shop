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
  console.log('Starting user seed...');

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

  console.log('✓ Created admin user:', admin.email);
  console.log('  - Default password: admin123');
  console.log('  - IMPORTANT: Change this password in production!');

  // Create some test users
  const testUserPassword = await bcrypt.hash('user123', 10);

  const testUser1 = await prisma.user.upsert({
    where: { email: 'max@example.com' },
    update: {},
    create: {
      name: 'Max Mustermann',
      email: 'max@example.com',
      password: testUserPassword,
      isAdmin: false,
    },
  });

  console.log('✓ Created test user:', testUser1.email);

  const testUser2 = await prisma.user.upsert({
    where: { email: 'erika@example.com' },
    update: {},
    create: {
      name: 'Erika Musterfrau',
      email: 'erika@example.com',
      password: testUserPassword,
      isAdmin: false,
    },
  });

  console.log('✓ Created test user:', testUser2.email);
  console.log('\n📝 Test user credentials:');
  console.log('  Email: max@example.com or erika@example.com');
  console.log('  Password: user123');
  console.log('\n✅ User seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
