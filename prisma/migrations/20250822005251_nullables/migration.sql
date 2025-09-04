/*
  Warnings:

  - You are about to drop the column `user_id` on the `bank_information` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bank_information" DROP COLUMN "user_id",
ALTER COLUMN "account_number" DROP NOT NULL,
ALTER COLUMN "ifs_code" DROP NOT NULL,
ALTER COLUMN "bank_name" DROP NOT NULL,
ALTER COLUMN "branch_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "job_information" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;
