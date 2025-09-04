-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "profile_visibility" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "rota_rule_settings" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "allow_member_swap_shifts" BOOLEAN NOT NULL DEFAULT false,
    "min_shift_duration" INTEGER NOT NULL,
    "max_shift_duration" INTEGER NOT NULL,
    "min_time_between_shifts" INTEGER NOT NULL,
    "max_consecutive_workdays" INTEGER NOT NULL,
    "max_weekly_hours_per_employee" INTEGER NOT NULL,
    "min_weekly_hours_per_employee" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rota_rule_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rota_rule_settings_company_id_key" ON "rota_rule_settings"("company_id");

-- AddForeignKey
ALTER TABLE "rota_rule_settings" ADD CONSTRAINT "rota_rule_settings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
