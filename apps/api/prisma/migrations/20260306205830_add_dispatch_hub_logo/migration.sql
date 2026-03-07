-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'DISPATCH';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "vatAmount" DECIMAL(10,2) DEFAULT 0;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "lga" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "vatEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vatRate" DECIMAL(5,2) NOT NULL DEFAULT 7.5;

-- CreateTable
CREATE TABLE "DispatchProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "state" TEXT,
    "lga" TEXT,
    "country" TEXT DEFAULT 'Nigeria',
    "coverageAreas" JSONB,
    "baseRates" JSONB,
    "vehicleTypes" JSONB,
    "isInterstate" BOOLEAN NOT NULL DEFAULT false,
    "bankDetails" JSONB,
    "utilityBill" TEXT,
    "cacDocument" TEXT,
    "cacNumber" TEXT,
    "logo" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DispatchProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchTask" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "dispatchProfileId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "deliveryPin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DispatchTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DispatchProfile_userId_key" ON "DispatchProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DispatchTask_orderId_key" ON "DispatchTask"("orderId");

-- AddForeignKey
ALTER TABLE "DispatchProfile" ADD CONSTRAINT "DispatchProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchTask" ADD CONSTRAINT "DispatchTask_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchTask" ADD CONSTRAINT "DispatchTask_dispatchProfileId_fkey" FOREIGN KEY ("dispatchProfileId") REFERENCES "DispatchProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
