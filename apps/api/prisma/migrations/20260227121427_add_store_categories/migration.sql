/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `bankCode` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `cacNumber` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `idType` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `ninBvn` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `paystackSubaccountCode` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `subaccountStatus` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `utilityBill` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `Store` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_buyerId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "discount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'ONLINE',
ALTER COLUMN "buyerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "accountNumber",
DROP COLUMN "bankCode",
DROP COLUMN "bankName",
DROP COLUMN "cacNumber",
DROP COLUMN "idType",
DROP COLUMN "ninBvn",
DROP COLUMN "paystackSubaccountCode",
DROP COLUMN "subaccountStatus",
DROP COLUMN "taxId",
DROP COLUMN "utilityBill",
DROP COLUMN "verificationStatus",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "aiFinancials" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiInventory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiMessaging" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiStrategy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "categories" JSONB,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "onboardingDismissed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "paystackPublicKey" TEXT,
ADD COLUMN     "paystackSecretKey" TEXT,
ADD COLUMN     "paystackWebhookSecret" TEXT,
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "twitter" TEXT;

-- CreateIndex
CREATE INDEX "EventLog_storeId_eventType_idx" ON "EventLog"("storeId", "eventType");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "User_storeId_idx" ON "User"("storeId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
