import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  AppType, 
  ClainEligibility, 
  HolidayTypes, 
  ProductivityTrackingMethods, 
  ProductivityVisibility, 
  RecurrenceType, 
  TrackingMethod, 
  WEEKDAY 
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';

export class CompanyUpdateDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  heardAboutUs?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  totalEmployee?: string;

  @ApiPropertyOptional({ enum: WEEKDAY, default: WEEKDAY.MONDAY })
  @IsOptional()
  @IsEnum(WEEKDAY)
  startWeek?: WEEKDAY;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ type: [String], enum: WEEKDAY })
  @IsOptional()
  @IsEnum(WEEKDAY, { each: true })
  workingDays?: WEEKDAY[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  memberTimezone?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  employeeWorkingDayChoice?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  resumptionTime?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  closingTime?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  breakTime?: string;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  displayRate: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  profileVisibility: boolean;
}

export class RotaRuleSettingDto {
  @ApiProperty()
  @IsBoolean()
  allowMemberSwapShifts: boolean;

  @ApiProperty({ description: 'Minimum shift duration in hours' })
  @IsInt()
  @Min(1)
  minShiftDuration: number;

  @ApiProperty({ description: 'Maximum shift duration in hours' })
  @IsInt()
  @Min(1)
  maxShiftDuration: number;

  @ApiProperty({ description: 'Minimum rest time between shifts in hours' })
  @IsInt()
  @Min(0)
  minTimeBetweenShifts: number;

  @ApiProperty({ description: 'Maximum consecutive workdays allowed' })
  @IsInt()
  @Min(1)
  maxConsecutiveWorkdays: number;

  @ApiProperty({ description: 'Maximum weekly hours per employee' })
  @IsInt()
  @Min(1)
  maxWeeklyHoursPerEmployee: number;

  @ApiProperty({ description: 'Minimum weekly hours per employee' })
  @IsInt()
  @Min(0)
  minWeeklyHoursPerEmployee: number;
}

export class ShiftSettingDto {
  @ApiProperty()
  @IsBoolean()
  enableShiftTrading: boolean;

  @ApiProperty()
  @IsBoolean()
  allowTradesAcrossLocations: boolean;

  @ApiProperty()
  @IsBoolean()
  allowTradesAcrossRoles: boolean;

  @ApiProperty({ required: false, description: 'Minimum notice time (hours) for trade requests' })
  @IsOptional()
  @IsInt()
  @Min(0)
  minNoticeTimeForTradeRequest?: number;

  @ApiProperty({ required: false, description: 'Latest approval time before shift (hours)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  latestApprovalTimeBeforeShift?: number;

  @ApiProperty()
  @IsBoolean()
  allowSameDayShiftTrades: boolean;

  @ApiProperty()
  @IsBoolean()
  enableOpenShifts: boolean;

  @ApiProperty({ required: false, description: 'Claim eligibility type (all, qualified, branch/department)' })
  @IsOptional()
  @IsString()
  claimEligibility?:ClainEligibility;

  @ApiProperty({ required: false, description: 'Minimum notice to claim open shift (hours)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  minNoticeToClaim?: number;

  @ApiProperty()
  @IsBoolean()
  limitOpenShiftsPerWeekPerEmployee: boolean;

  @ApiProperty()
  @IsBoolean()
  allowAdminOverride: boolean;
}

export class HolidayRequestRuleSettingDto {
  @ApiProperty()
  @IsBoolean()
  enableHolidayRequests: boolean;

  @ApiProperty({ type: [String], description: 'Types of leave allowed' })
  @IsArray()
  @IsString({ each: true })
  holidayTypesAllowed: HolidayTypes[];

  @ApiProperty({ description: 'Minimum notice before requesting leave (days)' })
  @IsInt()
  @Min(0)
  minNoticeBeforeLeave: number;

  @ApiProperty({ description: 'Maximum days off per request' })
  @IsInt()
  @Min(1)
  maxDaysOffPerRequest: number;

  @ApiProperty()
  @IsBoolean()
  allowHalfDayRequests: boolean;

  @ApiProperty({ description: 'Minimum tenure before requesting leave (days)' })
  @IsInt()
  @Min(0)
  minTenureBeforeLeave: number;

  @ApiProperty()
  @IsBoolean()
  excludeNewStarters: boolean;

  @ApiProperty({ type: String, description: 'Approval required from (Line Manager, HR/Admin, etc.)' })
  @IsString()
  approvalRequiredFrom: string;

  @ApiProperty()
  @IsBoolean()
  autoApproveIfNoConflict: boolean;

  @ApiProperty({ description: 'Days before escalation if unapproved' })
  @IsInt()
  @Min(1)
  escalateUnapprovedAfterDays: number;

  @ApiProperty()
  @IsBoolean()
  allowMultiLevelApprovals: boolean;
}

export class AppsDto {
  @ApiProperty({ example: 'Slack' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Communication', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'https://slack.com', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ enum: AppType, default: AppType.PRODUCTIVE })
  @IsOptional()
  @IsEnum(AppType)
  type?: AppType;
}

export class DigiTimeSettingDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  enableTimeTracking: boolean;

  @ApiProperty({ enum: TrackingMethod, required: false })
  @IsOptional()
  @IsEnum(TrackingMethod)
  trackingMethod?: TrackingMethod;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  baseHourlyRate: number;

  @ApiProperty({ example: 'GBP', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowRoleBasedRates: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowCustomRatePerEmployee: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  productivityEnabled: boolean;

  @ApiProperty({
    type: [String],
    enum: ProductivityTrackingMethods,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ProductivityTrackingMethods, { each: true })
  productivityTrackingMethod?: ProductivityTrackingMethods[];

  @ApiProperty({
    enum: ProductivityVisibility,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductivityVisibility)
  productivityVisibility?: ProductivityVisibility;

  @ApiProperty({ example: true })
  @IsBoolean()
  enableOvertime: boolean;

  @ApiProperty({ enum: RecurrenceType, required: false })
  @IsOptional()
  @IsEnum(RecurrenceType)
  trackingType?: RecurrenceType;

  @ApiProperty({ example: 8, required: false })
  @IsOptional()
  @IsNumber()
  standardDailyHours?: number;

  @ApiProperty({ example: 40, required: false })
  @IsOptional()
  @IsNumber()
  standardWeeklyHours?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  maxDailyOvertime?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  maxWeeklyOvertime?: number;

  @ApiProperty({ example: 15.0, required: false })
  @IsOptional()
  @IsNumber()
  standardOvertimeRate?: number;

  @ApiProperty({ example: 20.0, required: false })
  @IsOptional()
  @IsNumber()
  weekendOvertimeRate?: number;

  @ApiProperty({ type: [AppsDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppsDto)
  apps?: AppsDto[];
}

export class BreakSettingDto {
  @ApiProperty({ example: 'Tea break' })
  @IsString()
  name: string;

  @ApiProperty({ example: 15, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: true, description: 'Whether this break is active' })
  @IsBoolean()
  @IsOptional()
  status?: boolean = true;
}

export class BreakComplianceSettingDto {
  @ApiProperty({ example: true, description: 'Enable or disable breaks globally' })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: [BreakSettingDto], description: 'List of defined breaks' })
  @IsOptional()
  breaks?: BreakSettingDto[];
}








