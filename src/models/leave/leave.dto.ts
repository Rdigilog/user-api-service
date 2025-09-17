// leave-policy.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateLeavePolicyDto {
  @ApiProperty({ example: 'Annual Leave' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Leave for annual vacation', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 20, default: 0 })
  @IsInt()
  @Min(0)
  daysPerYear: number = 0;
}

export class UpdateLeavePolicyDto extends PartialType(CreateLeavePolicyDto) {}
