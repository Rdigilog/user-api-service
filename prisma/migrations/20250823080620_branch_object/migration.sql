/*
  Warnings:

  - Added the required column `country_code` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `branches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "country_code" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "branches_company_id_country_code_idx" ON "branches"("company_id", "country_code");

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "countries"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
