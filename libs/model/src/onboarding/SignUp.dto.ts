import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class InitiateRegistrationDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'jondoe@exmple.com' })
  @IsString()
  @IsNotEmpty()
  businessEmail: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  // @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Facebook, friend, ad, etc.' })
  @IsString()
  @IsNotEmpty()
  heardAboutUs: string;

  @ApiProperty({
    description: 'lOGIN TYPE FIELD',
    type: 'string',
    example: 'SOCIAL', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsOptional()
  type?: 'SOCIAL' | 'NON_SOCIAL';
}

export class GoogleAuthDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456789012345678901' })
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @ApiProperty({
    example: 'https://lh3.googleusercontent.com/a/...',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...',
    description: 'Optional Google ID token for server-side verification.',
    required: false,
  })
  @IsOptional()
  @IsString()
  idToken?: string;
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
  memberId?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  roleId: string;
}
