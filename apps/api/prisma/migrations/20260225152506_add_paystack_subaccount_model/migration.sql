/*
  Warnings:

  - You are about to drop the column `paystackPublicKey` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `paystackSecretKey` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `paystackWebhookSecret` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,storeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone,storeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "amountGross" DECIMAL(10,2),
ADD COLUMN     "amountNet" DECIMAL(10,2),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paystackFee" DECIMAL(10,2),
ADD COLUMN     "settlementStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "subaccountCode" TEXT;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "paystackPublicKey",
DROP COLUMN "paystackSecretKey",
DROP COLUMN "paystackWebhookSecret",
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankCode" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "paystackSubaccountCode" TEXT,
ADD COLUMN     "subaccountStatus" TEXT DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "Payment_reference_idx" ON "Payment"("reference");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_storeId_key" ON "User"("email", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_storeId_key" ON "User"("phone", "storeId");
