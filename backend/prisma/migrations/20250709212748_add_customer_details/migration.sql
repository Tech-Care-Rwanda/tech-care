/*
  Warnings:

  - You are about to drop the column `skills` on the `TechnicianDetails` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `customer_details` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `customer_details` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `customer_details` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `customer_details` table. All the data in the column will be lost.
  - Added the required column `DateOfBirth` to the `TechnicianDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `TechnicianDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TechnicianDetails" DROP COLUMN "skills",
ADD COLUMN     "DateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "specialization" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "customer_details" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zipCode";
