/*
  Warnings:

  - You are about to drop the column `userid` on the `employees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,company_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employees_userid_company_id_idx";

-- DropIndex
DROP INDEX "employees_userid_company_id_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "userid",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "employees_user_id_company_id_idx" ON "employees"("user_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_company_id_key" ON "employees"("user_id", "company_id");
