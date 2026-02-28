-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "cacNumber" TEXT,
ADD COLUMN     "ninBvn" TEXT,
ADD COLUMN     "utilityBill" TEXT,
ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'unverified';
