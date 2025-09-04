-- CreateEnum
CREATE TYPE "WEEKDAY" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "address" TEXT,
ADD COLUMN     "currency_code" TEXT,
ADD COLUMN     "employee_workingday_choice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "member_timezone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "start_week" "WEEKDAY" DEFAULT 'MONDAY',
ADD COLUMN     "tax_id" TEXT,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "working_days" "WEEKDAY"[];
