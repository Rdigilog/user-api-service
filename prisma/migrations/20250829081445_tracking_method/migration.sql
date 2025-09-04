/*
  Warnings:

  - The `tracking_method` column on the `digi_time_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TrackingMethod" AS ENUM ('CLOCK_IN_OUT', 'MANUAL_ENTRY', 'ACTIVENESS');

-- AlterTable
ALTER TABLE "digi_time_settings" DROP COLUMN "tracking_method",
ADD COLUMN     "tracking_method" "TrackingMethod";
