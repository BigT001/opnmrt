/*
  Warnings:

  - You are about to drop the column `cacNumber` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "cacNumber",
ADD COLUMN     "taxId" TEXT;
