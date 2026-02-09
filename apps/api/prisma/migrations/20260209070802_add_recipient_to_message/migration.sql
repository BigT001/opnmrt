-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "recipientId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "accentColor" TEXT,
ADD COLUMN     "biography" TEXT,
ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "officialEmail" TEXT,
ADD COLUMN     "primaryColor" TEXT DEFAULT '#10b981',
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'DEFAULT',
ADD COLUMN     "themeConfig" JSONB,
ADD COLUMN     "useWhatsAppCheckout" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsappNumber" TEXT;

-- CreateIndex
CREATE INDEX "Message_recipientId_idx" ON "Message"("recipientId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
