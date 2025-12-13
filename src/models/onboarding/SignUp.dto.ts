/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  ValidateIf,
} from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ example: 'firebase-id-token' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === 'SOCIAL')
  idToken?: string;
}

export class InitiateRegistrationDto extends GoogleAuthDto {
  @ApiProperty({ example: 'SOCIAL | NON_SOCIAL' })
  @IsString()
  @IsNotEmpty()
  type: 'SOCIAL' | 'NON_SOCIAL';

  @ApiProperty({ example: 'John' })
  @IsString()
  @ValidateIf((o) => o.type === 'NON_SOCIAL')
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @ValidateIf((o) => o.type === 'NON_SOCIAL')
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  @ValidateIf((o) => o.type === 'NON_SOCIAL')
  @IsNotEmpty()
  businessEmail?: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @ValidateIf((o) => o.type === 'NON_SOCIAL')
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ example: 'Facebook, friend, ad' })
  @IsString()
  @ValidateIf((o) => o.type === 'NON_SOCIAL')
  @IsNotEmpty()
  heardAboutUs?: string;
}

export class EmailDTO {
  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;
}

export class PhoneNumberDTO {
  @ApiPropertyOptional({ example: 'Enter Phone Number' })
  @IsString()
  phoneNumber: string;
}
export class UsernameDTO {
  @ApiPropertyOptional({ example: 'Enter Phone Number/Email' })
  @IsString()
  username: string;
}
export class PhoneNumberLoginVerifyOtpDTO {
  @ApiPropertyOptional({ example: 'Enter Phone Number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '1234', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  code?: string;

  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class UserOtpVerification {
  @ApiProperty({
    description: 'User phone number or email',
    type: 'string',
    example: '1234', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '1234', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class CompanyDetailsDTO {
  @ApiPropertyOptional({ example: 'Enter Phone Number' })
  @IsString()
  companyName: string;

  @ApiPropertyOptional({
    example: '10-50',
    description: 'Total number of employees in a range format like 10-50',
  })
  @IsOptional()
  @Matches(/^\d+\s*-\s*\d+$/, {
    message: 'totalEmployee must be in the format "min-max", e.g., "10-50"',
  })
  totalEmployee: string;

  @ApiPropertyOptional({
    example: 'FinTech',
    description: 'Company Industry i.e FinTech Agriculture etc',
  })
  @IsOptional()
  @IsString()
  industry: string;

  @ApiPropertyOptional({
    example: 'uuid',
    description: 'Subscription PLan Id',
  })
  @IsOptional()
  @IsString()
  planId: string;

  @ApiPropertyOptional({
    example: '08:00',
    description: "Company's resumption time",
  })
  @IsOptional()
  @IsString()
  resumptionTime: string;

  @ApiPropertyOptional({
    example: '17:00',
    description: "Company's resumption time",
  })
  @IsOptional()
  @IsString()
  closingTime: string;
}

export class OtpDTO extends EmailDTO {
  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '1234', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class resetPasswordDTO extends OtpDTO {
  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class InviteUserDTO extends EmailDTO {
  @ApiPropertyOptional({ example: '1234ABDC' })
  @IsOptional()
  @IsString()
  memberId: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  roleId: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  branchId: string;
}

export interface SocialLoginRequest {
  provider: string;
  email: string;
  providerId: string;
  firstName: string;
  lastName: string;
}
