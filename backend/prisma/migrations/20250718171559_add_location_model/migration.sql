-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "locationId" INTEGER;

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "addressName" TEXT,
    "description" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "googleMapUrl" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "locations_customerId_idx" ON "locations"("customerId");

-- CreateIndex
CREATE INDEX "locations_customerId_isDefault_idx" ON "locations"("customerId", "isDefault");

-- CreateIndex
CREATE INDEX "bookings_locationId_idx" ON "bookings"("locationId");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
