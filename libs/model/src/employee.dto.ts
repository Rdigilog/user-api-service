import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

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
