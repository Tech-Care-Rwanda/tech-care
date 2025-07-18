/*
  Warnings:

  - You are about to drop the column `isActive` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `timeEstimate` on the `services` table. All the data in the column will be lost.
  - The `startTime` column on the `time_slots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endTime` column on the `time_slots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `availabilityId` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_availabilityId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_customerId_fkey";

-- DropIndex
DROP INDEX "locations_customerId_isDefault_idx";

-- DropIndex
DROP INDEX "services_categoryId_idx";

-- DropIndex
DROP INDEX "services_isActive_idx";

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "availabilityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "isActive",
DROP COLUMN "isDefault";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "isActive",
DROP COLUMN "timeEstimate";

-- AlterTable
ALTER TABLE "time_slots" ADD COLUMN     "date" DATE,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIME,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIME;

-- DropTable
DROP TABLE "payments";

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "technician_availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
