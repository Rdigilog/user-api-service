/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `bank_information` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employee_id]` on the table `emergency_contacts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employee_id]` on the table `job_information` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `job_information` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bank_information_employee_id_key" ON "bank_information"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_contacts_employee_id_key" ON "emergency_contacts"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_information_employee_id_key" ON "job_information"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_information_user_id_key" ON "job_information"("user_id");
