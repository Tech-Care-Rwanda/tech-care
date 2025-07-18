/*
  Warnings:

  - Made the column `date` on table `time_slots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `time_slots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `time_slots` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "time_slots" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL;
