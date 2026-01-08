-- CreateTable
CREATE TABLE "Promo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "borderColor" TEXT NOT NULL DEFAULT 'border-blue-400',
    "buttonColor" TEXT NOT NULL DEFAULT 'bg-blue-600',
    "buttonHoverColor" TEXT NOT NULL DEFAULT 'hover:bg-blue-700',
    "whatsappText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);
