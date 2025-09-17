import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BloodGroup,
  Gender,
  MaritalStatus,
  Relationship,
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

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // employeeId?: string;

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

export class EmergencyContactDto {
  @ApiProperty({ description: 'uuid' })
  @IsOptional()
  @IsString()
  id: string;

  @ApiPropertyOptional({ description: 'Name of the emergency contact' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Relationship with the user' })
  @IsOptional()
  @IsString()
  relationship?: Relationship;

  @ApiPropertyOptional({ description: 'Address of the emergency contact' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Country code of the contact' })
  @IsOptional()
  @IsString()
  countryCode?: string;
}

export class JobInformationDto {
  @ApiProperty({ description: 'uuid' })
  @IsOptional()
  @IsString()
  id: string;

  @ApiPropertyOptional({ description: 'Member identifier' })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiPropertyOptional({ description: 'Employment date in string format' })
  @IsOptional()
  @IsString()
  employmentDate?: string;

  @ApiPropertyOptional({ description: 'Type of work (enum in DB)' })
  @IsOptional()
  @IsString()
  workType?: WorkType;

  @ApiProperty({ description: 'Job location' })
  @IsString()
  location: string;
}

export class BankInformationDto {
  @ApiProperty({ description: 'uuid' })
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Bank account number' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ description: 'IFSC / IFS code of the bank' })
  @IsString()
  ifsCode: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  bankName: string;

  @ApiProperty({ description: 'Branch name of the bank' })
  @IsString()
  branchName: string;
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
  Gender?: Gender;

  @ApiPropertyOptional({ description: 'Country dialing code' })
  @IsOptional()
  @IsString()
  countryCode?: string;

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
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional({ description: 'Known allergies' })
  @IsOptional()
  @IsString()
  allergy?: string;

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
