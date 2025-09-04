-- AlterTable
ALTER TABLE "job_information" ADD COLUMN     "currencyCode" TEXT,
ADD COLUMN     "payRatePerHour" DOUBLE PRECISION DEFAULT 0;
