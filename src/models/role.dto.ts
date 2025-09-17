import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'The  name of the item',
    example: 'Gold Plan',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'An optional description of the item',
    example: 'Premium tier with all features',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'The UUID of the role to assign permissions to',
    example: '5f6e8c0c-9c2f-4a1d-a1b4-1e23c4f5b678',
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    description: 'Array of permission UUIDs to be assigned to the role',
    example: [
      'f5d6e8c0-9c2f-4a1d-a1b4-1e23c4f5b111',
      'a2d6e8c0-9c2f-4a1d-a1b4-1e23c4f5b222',
    ],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  permissions: string[];
}
