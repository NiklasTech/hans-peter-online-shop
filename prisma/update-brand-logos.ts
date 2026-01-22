/**
 * Script to update brand logos with SVG URLs from Simple Icons CDN
 * Run with: npx tsx prisma/update-brand-logos.ts
 */

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

// Brand logo mapping using Simple Icons CDN
// Format: https://cdn.simpleicons.org/[slug]/[color]
const BRAND_LOGOS: Record<string, string> = {
  // Tech Brands
  'Apple': 'https://cdn.simpleicons.org/apple/000000',
  'Samsung': 'https://cdn.simpleicons.org/samsung/1428A0',
  'Sony': 'https://cdn.simpleicons.org/sony/000000',
  'LG': 'https://cdn.simpleicons.org/lg/A50034',
  'ASUS': 'https://cdn.simpleicons.org/asus/000000',
  'MSI': 'https://cdn.simpleicons.org/msi/FF0000',
  'Logitech': 'https://cdn.simpleicons.org/logitech/00B8FC',
  'NVIDIA': 'https://cdn.simpleicons.org/nvidia/76B900',
  'AMD': 'https://cdn.simpleicons.org/amd/ED1C24',
  'Intel': 'https://cdn.simpleicons.org/intel/0071C5',
  'HP': 'https://cdn.simpleicons.org/hp/0096D6',
  'Dell': 'https://cdn.simpleicons.org/dell/007DB8',
  'Lenovo': 'https://cdn.simpleicons.org/lenovo/E2231A',
  'Acer': 'https://cdn.simpleicons.org/acer/83B81A',

  // Fashion Brands
  'Nike': 'https://cdn.simpleicons.org/nike/000000',
  'Adidas': 'https://cdn.simpleicons.org/adidas/000000',
  'Puma': 'https://cdn.simpleicons.org/puma/000000',
  'Under Armour': 'https://cdn.simpleicons.org/underarmour/1D1D1D',
  'Reebok': 'https://cdn.simpleicons.org/reebok/000000',
  'New Balance': 'https://cdn.simpleicons.org/newbalance/CC0000',
  'Levis': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Levi%27s_logo.svg',
  'H&M': 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg',
  'Zara': 'https://cdn.simpleicons.org/zara/000000',
  'Calvin Klein': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Calvin_klein_logo.svg',
  'Tommy Hilfiger': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Tommy_hilfig_vectorlogo.svg',

  // Home & Lifestyle
  'IKEA': 'https://cdn.simpleicons.org/ikea/0058A3',
  'Bosch': 'https://cdn.simpleicons.org/bosch/EA0016',
  'Philips': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg',
  'Siemens': 'https://cdn.simpleicons.org/siemens/009999',
  'WMF': 'https://upload.wikimedia.org/wikipedia/commons/5/5d/WMF-Logo.svg',

  // Beauty & Personal Care
  'L\'Oréal': 'https://cdn.simpleicons.org/loreal',
  'Nivea': 'https://cdn.simpleicons.org/nivea',
  'Maybelline': 'https://cdn.simpleicons.org/maybelline',
  'Dove': 'https://cdn.simpleicons.org/dove',

  // Food & Beverage
  'Nestlé': 'https://cdn.simpleicons.org/nestle',
  'Milka': 'https://cdn.simpleicons.org/milka',
  'Lindt': 'https://cdn.simpleicons.org/lindt',
  'Jacobs': 'https://cdn.simpleicons.org/jacobs',
  'Barilla': 'https://cdn.simpleicons.org/barilla',
  'Coca-Cola': 'https://cdn.simpleicons.org/cocacola/F40009',
  'Pepsi': 'https://cdn.simpleicons.org/pepsi/0065C3',
  'Starbucks': 'https://cdn.simpleicons.org/starbucks/00704A',
  'McDonald\'s': 'https://cdn.simpleicons.org/mcdonalds/FBC817',

  // Automotive
  'BMW': 'https://cdn.simpleicons.org/bmw/000000',
  'Mercedes-Benz': 'https://cdn.simpleicons.org/mercedesbenz/000000',
  'Volkswagen': 'https://cdn.simpleicons.org/volkswagen/000000',
  'Audi': 'https://cdn.simpleicons.org/audi/BB0A30',
  'Toyota': 'https://cdn.simpleicons.org/toyota/EB0A1E',
  'Tesla': 'https://cdn.simpleicons.org/tesla/CC0000',

  // Gaming
  'PlayStation': 'https://cdn.simpleicons.org/playstation/003087',
  'Xbox': 'https://cdn.simpleicons.org/xbox/107C10',
  'Nintendo': 'https://cdn.simpleicons.org/nintendo/E60012',
  'Razer': 'https://cdn.simpleicons.org/razer/00FF00',
  'SteelSeries': 'https://cdn.simpleicons.org/steelseries/FF5200',

  // Audio
  'Bose': 'https://cdn.simpleicons.org/bose/000000',
  'JBL': 'https://cdn.simpleicons.org/jbl/FF3300',
  'Sennheiser': 'https://cdn.simpleicons.org/sennheiser/000000',
  'Beats': 'https://cdn.simpleicons.org/beatsbydre/EC1C24',

  // Other Tech
  'Huawei': 'https://cdn.simpleicons.org/huawei/FF0000',
  'Xiaomi': 'https://cdn.simpleicons.org/xiaomi/FF6900',
  'OnePlus': 'https://cdn.simpleicons.org/oneplus/F5010C',
  'Google': 'https://cdn.simpleicons.org/google/4285F4',
  'Microsoft': 'https://cdn.simpleicons.org/microsoft/5E5E5E',

  // Toys & Games
  'LEGO': 'https://cdn.simpleicons.org/lego',
  'Hasbro': 'https://cdn.simpleicons.org/hasbro',
  'Mattel': 'https://cdn.simpleicons.org/mattel',
  'Ravensburger': 'https://cdn.simpleicons.org/ravensburger',
  'Playmobil': 'https://cdn.simpleicons.org/playmobil',

  // Industrial & Tools
  'Shell': 'https://cdn.simpleicons.org/shell',
  '3M': 'https://cdn.simpleicons.org/3m',
  'Castrol': 'https://cdn.simpleicons.org/castrol',
  'Fiskars': 'https://cdn.simpleicons.org/fiskars',

  // Sports & Outdoor
  'Decathlon': 'https://cdn.simpleicons.org/decathlon',
  'Wilson': 'https://cdn.simpleicons.org/wilson',
  'Spalding': 'https://cdn.simpleicons.org/spalding',
};

async function updateBrandLogos() {
  console.log('🎨 Starting brand logo update...\n');

  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  try {
    // Get all brands from database
    const brands = await prisma.brand.findMany();
    console.log(`📊 Found ${brands.length} brands in database\n`);

    for (const brand of brands) {
      const logoUrl = BRAND_LOGOS[brand.name];

      if (logoUrl) {
        // Update brand with logo URL
        await prisma.brand.update({
          where: { id: brand.id },
          data: { image: logoUrl },
        });
        console.log(`✅ Updated: ${brand.name}`);
        updatedCount++;
      } else if (brand.image) {
        console.log(`⏭️  Skipped: ${brand.name} (already has logo)`);
        skippedCount++;
      } else {
        console.log(`⚠️  Not found: ${brand.name} (no logo mapping available)`);
        notFoundCount++;
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ⚠️  Not found: ${notFoundCount}`);
    console.log(`   📊 Total: ${brands.length}`);
    console.log('\n✨ Brand logo update completed!');
  } catch (error) {
    console.error('❌ Error updating brand logos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateBrandLogos()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
