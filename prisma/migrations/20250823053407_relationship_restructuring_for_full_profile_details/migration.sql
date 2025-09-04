/*
  Warnings:

  - You are about to drop the column `company_id` on the `bank_information` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `emergency_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `job_information` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bank_information" DROP CONSTRAINT "bank_information_company_id_fkey";

-- DropForeignKey
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_company_id_fkey";

-- DropForeignKey
ALTER TABLE "job_information" DROP CONSTRAINT "job_information_company_id_fkey";

-- AlterTable
ALTER TABLE "bank_information" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "emergency_contacts" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "job_information" DROP COLUMN "company_id";

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
