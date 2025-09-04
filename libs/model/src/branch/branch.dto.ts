import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Name of the branch',
    example: 'New York HQ',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the branch',
    example: 'Main headquarters in New York',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Country ISO code',
    example: 'US',
  })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({
    description: 'user id ',
    example: 'US',
  })
  @IsString()
  @IsNotEmpty()
  managerId: string;

  @ApiProperty({
    description: 'Timezone identifier (IANA format)',
    example: 'America/New_York',
  })
  @IsString()
  @IsNotEmpty()
  timezone: string;
}

export class AssignBranchUserDto {
  //   @ApiProperty({
  //     description: 'Branch ID',
  //     example: 'e9a8f87a-3b45-4c6f-9d79-d933aa1f1e5c',
  //   })
  //   @IsUUID()
  //   branchId: string;

  @ApiProperty({
    description: 'Array of User IDs to assign to the branch',
    type: [String],
    example: [
      'a3b47c61-2c11-4a6f-8b7d-2d8c3f947be1',
      'b8f23a94-3a9b-45a0-b65c-7f4d2ec1d9aa',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  userIds: string[];
}
