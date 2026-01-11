import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/de';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('Starting user seed...\n');

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
  console.log('  - IMPORTANT: Change this password in production!\n');

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

  // Create 10 additional test users with addresses
  console.log('\n👥 Creating additional test users with addresses...');

  const additionalUsers = [
    { firstName: 'Thomas', lastName: 'Schmidt', email: 'thomas.schmidt@example.com' },
    { firstName: 'Anna', lastName: 'Müller', email: 'anna.mueller@example.com' },
    { firstName: 'Michael', lastName: 'Weber', email: 'michael.weber@example.com' },
    { firstName: 'Laura', lastName: 'Wagner', email: 'laura.wagner@example.com' },
    { firstName: 'Sebastian', lastName: 'Becker', email: 'sebastian.becker@example.com' },
    { firstName: 'Julia', lastName: 'Schulz', email: 'julia.schulz@example.com' },
    { firstName: 'Markus', lastName: 'Hoffmann', email: 'markus.hoffmann@example.com' },
    { firstName: 'Sarah', lastName: 'Koch', email: 'sarah.koch@example.com' },
    { firstName: 'Daniel', lastName: 'Richter', email: 'daniel.richter@example.com' },
    { firstName: 'Lisa', lastName: 'Klein', email: 'lisa.klein@example.com' },
  ];

  for (const userData of additionalUsers) {
    // Create user
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: testUserPassword,
        isAdmin: false,
        defaultSupplier: faker.helpers.arrayElement(['DHL', 'DPD', 'Hermes', 'UPS']),
        defaultPayment: faker.helpers.arrayElement(['Kreditkarte', 'PayPal', 'Rechnung', 'Sofortüberweisung']),
      },
    });

    // Create 1-3 addresses for each user
    const numAddresses = faker.number.int({ min: 1, max: 3 });
    const createdAddresses = [];

    for (let i = 0; i < numAddresses; i++) {
      const address = await prisma.address.create({
        data: {
          userId: user.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          street: faker.location.street(),
          houseNumber: faker.location.buildingNumber(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode('#####'),
          countryCode: 'DE',
          phone: faker.phone.number(),
        },
      });
      createdAddresses.push(address);
    }

    // Set first address as default
    if (createdAddresses.length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          defaultAddressId: createdAddresses[0].id,
        },
      });
    }

    console.log(`  ✓ ${user.name} (${createdAddresses.length} ${createdAddresses.length === 1 ? 'Adresse' : 'Adressen'})`);
  }

  console.log('\n📝 Test user credentials:');
  console.log('  Email: max@example.com, erika@example.com, thomas.schmidt@example.com, etc.');
  console.log('  Password: user123');
  console.log('\n✅ User seed completed successfully!');
  console.log(`📊 Total users created: ${additionalUsers.length + 3} (1 admin + ${additionalUsers.length + 2} users)`);
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
