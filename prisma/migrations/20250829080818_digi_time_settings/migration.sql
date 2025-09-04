/*
  Warnings:

  - Added the required column `break_time` to the `job_information` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductivityTrackingMethods" AS ENUM ('ACTIVE_TIME', 'APP_USAGE', 'SCREENSHOT', 'SELF_REPORT');

-- CreateEnum
CREATE TYPE "ProductivityVisibility" AS ENUM ('EMPLOYEE_DASHBOARD', 'MANAGER_OVERVIEW', 'HR_ONLY');

-- CreateEnum
CREATE TYPE "AppType" AS ENUM ('PRODUCTIVE', 'UNPRODUCTIVE');

-- AlterTable
ALTER TABLE "digi_time_settings" ADD COLUMN     "enable_overtime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "max_daily_overtime" INTEGER,
ADD COLUMN     "max_weekly_overtime" INTEGER,
ADD COLUMN     "productivityEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productivity_tracking_method" "ProductivityTrackingMethods"[],
ADD COLUMN     "standard_daily_hours" INTEGER,
ADD COLUMN     "standard_overtime_rate" DOUBLE PRECISION,
ADD COLUMN     "standard_weekly_hours" INTEGER,
ADD COLUMN     "tracking_type" "RecurrenceType",
ADD COLUMN     "visibility" "ProductivityVisibility",
ADD COLUMN     "weekend_overtime_rate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "job_information" ADD COLUMN     "break_time" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "setting_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "url" TEXT,
    "type" "AppType" NOT NULL DEFAULT 'PRODUCTIVE',

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "break_compliance_settings" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "break_compliance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "break_settings" (
    "id" TEXT NOT NULL,
    "compliance_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "break_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "break_compliance_settings_company_id_key" ON "break_compliance_settings"("company_id");

-- AddForeignKey
ALTER TABLE "apps" ADD CONSTRAINT "apps_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "digi_time_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "break_compliance_settings" ADD CONSTRAINT "break_compliance_settings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "break_settings" ADD CONSTRAINT "break_settings_compliance_id_fkey" FOREIGN KEY ("compliance_id") REFERENCES "break_compliance_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
