import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BillingCycle,
  BloodGroup,
  Gender,
  MaritalStatus,
  Relationship,
  ScreenshotFrequency,
  TrackingType,
  UserStatus,
  WorkType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString() // Validates as a phone number, null allows any region
  phoneNumber?: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Current status of the user',
    enum: UserStatus,
    example: UserStatus.ONLINE, // 👈 Example shown in Swagger
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // address?: string;

  // @ApiPropertyOptional({ enum: MaritalStatus })
  // @IsOptional()
  // @IsEnum(MaritalStatus)
  // maritalStatus?: MaritalStatus;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // bio?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // interest?: string;

  // @ApiPropertyOptional({ enum: Gender })
  // @IsOptional()
  // @IsEnum(Gender)
  // Gender?: Gender;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // countryCode?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // religion?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // altPhoneNumber?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // dateOfBirth?: string;

  // @ApiPropertyOptional({ enum: BloodGroup })
  // @IsOptional()
  // @IsEnum(BloodGroup)
  // bloodGroup?: BloodGroup;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // allergy?: string;
}

export class ChangePassword {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  confirmPassword: string;
}

export class ChangeStatus {
  @ApiProperty({
    description: 'Update user status to active and inactive',
    example: true,
  })
  @IsBoolean()
  active: boolean;
}

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Full name of the employee' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Email address of the employee' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number of the employee' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Branch ID the employee belongs to' })
  @IsString()
  branchId!: string;
}

export interface FileJobDto {
  file: Express.Multer.File;
  fieldName: string;
}

export class EmergencyContactDto {
  @ApiPropertyOptional({ description: 'Name of the emergency contact' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Relationship with the employee' })
  @IsOptional()
  @IsEnum(Relationship)
  relationship?: Relationship;

  @ApiPropertyOptional({ description: 'Address of the emergency contact' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Country code of the contact' })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({ description: 'Phone number of the emergency contact' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class JobInformationDto {
  @ApiPropertyOptional({ description: 'Member identifier' })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiPropertyOptional({ description: 'Job role ID' })
  @IsOptional()
  @IsString()
  jobRoleId?: string;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({ description: 'Pay rate per hour' })
  @IsOptional()
  // @IsNumber()
  payRatePerHour?: number;

  @ApiPropertyOptional({ description: 'Work status' })
  @IsOptional()
  @IsString()
  workStatus?: string;

  @ApiPropertyOptional({ description: 'Days of work (array of weekdays)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workDays?: string[];

  @ApiPropertyOptional({ description: 'Break time string' })
  @IsOptional()
  @IsString()
  breakTime?: string;

  @ApiPropertyOptional({
    description: 'Employment date in string format (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  employmentDate?: string;

  @ApiPropertyOptional({ enum: WorkType, description: 'Work type' })
  @IsOptional()
  @IsEnum(WorkType)
  workType?: WorkType;

  @ApiPropertyOptional({ description: 'Job location' })
  @IsOptional()
  @IsString()
  location?: string;
}

export class BankInformationDto {
  @ApiPropertyOptional({ description: 'Bank account number' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ description: 'IFSC / IFS code of the bank' })
  @IsOptional()
  @IsString()
  ifsCode?: string;

  @ApiPropertyOptional({ description: 'Bank name' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ description: 'Branch name of the bank' })
  @IsOptional()
  @IsString()
  branchName?: string;
}

export class EmployeeDto {
  @ApiPropertyOptional({ description: 'Residential address of the employee' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number of the employee' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    enum: MaritalStatus,
    description: 'Marital status of the employee',
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ description: 'Short biography of the employee' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Employee interests' })
  @IsOptional()
  @IsString()
  interest?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Gender of the employee' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Religion of the employee' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiPropertyOptional({ description: 'Alternative phone number' })
  @IsOptional()
  @IsString()
  altPhoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Date of birth (string format, e.g. YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    enum: BloodGroup,
    description: 'Blood group of the employee',
  })
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional({ description: 'Known allergies' })
  @IsOptional()
  @IsString()
  allergy?: string;

  @ApiPropertyOptional({ description: 'Country dialing code' })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({ description: 'Timezone of the employee' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Currency code of the employee' })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({ description: 'Pay rate (default 0)' })
  @IsOptional()
  // @IsNumber()
  payRate?: number;

  @ApiPropertyOptional({ enum: BillingCycle, description: 'Billing period' })
  @IsOptional()
  @IsEnum(BillingCycle)
  period?: BillingCycle;

  @ApiPropertyOptional({ description: 'Annual leave days' })
  @IsOptional()
  // @IsNumber()
  annualLeave?: number;

  @ApiPropertyOptional({ description: 'Bank holidays' })
  @IsOptional()
  // @IsNumber()
  bankHoliday?: number;

  @ApiPropertyOptional({ description: 'Work hours' })
  @IsOptional()
  // @IsNumber()
  hours?: number;

  @ApiPropertyOptional({ description: 'Break time' })
  @IsOptional()
  @IsString()
  breakTime?: string;

  @ApiPropertyOptional({
    enum: ScreenshotFrequency,
    description: 'Screenshot frequency',
  })
  @IsOptional()
  @IsEnum(ScreenshotFrequency)
  screenshotFrequency?: ScreenshotFrequency;

  @ApiPropertyOptional({
    description: 'Screenshot interval in minutes',
  })
  @IsOptional()
  // @IsNumber()
  screenshotIntervalMinutes?: number;

  @ApiPropertyOptional({
    enum: TrackingType,
    description: 'App tracking type (OFF, APPS_ONLY, URLS_ONLY, BOTH)',
  })
  @IsOptional()
  @IsEnum(TrackingType)
  appTrackingType?: TrackingType;

  @ApiPropertyOptional({
    description: 'Notify user when screenshot is taken',
  })
  @IsOptional()
  // @IsBoolean()
  appScrennshotNotification?: boolean;

  @ApiPropertyOptional({
    description: 'Array of branch IDs employee belongs to',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  branchIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of department IDs employee belongs to',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departmentIds?: string[];

  @ApiPropertyOptional({ type: () => JobInformationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => JobInformationDto)
  jobInformation?: JobInformationDto;

  @ApiPropertyOptional({ type: () => EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @ApiPropertyOptional({ type: () => BankInformationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankInformationDto)
  bankInformation?: BankInformationDto;
}
