/*
  Warnings:

  - A unique constraint covering the columns `[name,brandId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFirstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingHouseNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingLastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPostalCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingStreet` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "shippingCity" TEXT NOT NULL,
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippingCountryCode" TEXT NOT NULL DEFAULT 'DE',
ADD COLUMN     "shippingFirstName" TEXT NOT NULL,
ADD COLUMN     "shippingHouseNumber" TEXT NOT NULL,
ADD COLUMN     "shippingLastName" TEXT NOT NULL,
ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "shippingPhone" TEXT,
ADD COLUMN     "shippingPostalCode" TEXT NOT NULL,
ADD COLUMN     "shippingStreet" TEXT NOT NULL,
ADD COLUMN     "trackingNumber" TEXT;

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_brandId_key" ON "Product"("name", "brandId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
