/*
  Warnings:

  - A unique constraint covering the columns `[company_id]` on the table `digi_time_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "digi_time_settings_company_id_key" ON "digi_time_settings"("company_id");
