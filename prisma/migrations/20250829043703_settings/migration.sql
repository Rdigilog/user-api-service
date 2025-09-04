-- AlterTable
ALTER TABLE "rota_rule_settings" ALTER COLUMN "min_shift_duration" DROP NOT NULL,
ALTER COLUMN "max_shift_duration" DROP NOT NULL,
ALTER COLUMN "min_time_between_shifts" DROP NOT NULL,
ALTER COLUMN "max_consecutive_workdays" DROP NOT NULL,
ALTER COLUMN "max_weekly_hours_per_employee" DROP NOT NULL,
ALTER COLUMN "min_weekly_hours_per_employee" DROP NOT NULL;

-- CreateTable
CREATE TABLE "shift_trade_settings" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "enable_shift_trading" BOOLEAN NOT NULL DEFAULT false,
    "allow_trades_across_locations" BOOLEAN NOT NULL DEFAULT false,
    "allow_trades_across_roles" BOOLEAN NOT NULL DEFAULT false,
    "min_notice_time_for_trade_request" INTEGER,
    "latest_approval_time_before_shift" INTEGER,
    "allow_same_day_shift_trades" BOOLEAN NOT NULL DEFAULT false,
    "enable_open_shifts" BOOLEAN NOT NULL DEFAULT false,
    "claim_eligibility" TEXT,
    "min_notice_to_claim" INTEGER,
    "limit_open_shifts_per_week_per_employee" BOOLEAN NOT NULL DEFAULT false,
    "allow_admin_override" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shift_trade_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday_request_rule_settings" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "enable_holiday_requests" BOOLEAN NOT NULL DEFAULT false,
    "holiday_types_allowed" TEXT[],
    "min_notice_before_leave" INTEGER,
    "max_days_off_per_request" INTEGER,
    "allow_half_day_requests" BOOLEAN NOT NULL DEFAULT false,
    "min_tenure_before_leave" INTEGER,
    "exclude_new_starters" BOOLEAN NOT NULL DEFAULT false,
    "approval_required_from" TEXT[],
    "auto_approve_if_no_conflict" BOOLEAN NOT NULL DEFAULT false,
    "escalate_unapproved_after_days" INTEGER,
    "allow_multi_level_approvals" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holiday_request_rule_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digi_time_settings" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "enable_time_tracking" BOOLEAN NOT NULL DEFAULT false,
    "tracking_method" TEXT,
    "base_hourly_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT DEFAULT 'GBP',
    "allow_role_based_rates" BOOLEAN NOT NULL DEFAULT false,
    "allow_custom_rate_per_employee" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digi_time_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shift_trade_settings_company_id_key" ON "shift_trade_settings"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_request_rule_settings_company_id_key" ON "holiday_request_rule_settings"("company_id");

-- CreateIndex
CREATE INDEX "holiday_request_rule_settings_company_id_idx" ON "holiday_request_rule_settings"("company_id");

-- CreateIndex
CREATE INDEX "digi_time_settings_company_id_idx" ON "digi_time_settings"("company_id");

-- AddForeignKey
ALTER TABLE "shift_trade_settings" ADD CONSTRAINT "shift_trade_settings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_request_rule_settings" ADD CONSTRAINT "holiday_request_rule_settings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digi_time_settings" ADD CONSTRAINT "digi_time_settings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
