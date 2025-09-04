/*
  Warnings:

  - The primary key for the `profile_branches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `company_id` on the `profile_branches` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "profile_branches" DROP CONSTRAINT "profile_branches_company_id_fkey";

-- AlterTable
ALTER TABLE "profile_branches" DROP CONSTRAINT "profile_branches_pkey",
DROP COLUMN "company_id",
ADD CONSTRAINT "profile_branches_pkey" PRIMARY KEY ("branch_id", "user_id");
