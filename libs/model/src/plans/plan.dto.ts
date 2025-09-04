import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class PlanDto {
  @ApiPropertyOptional({
    description: 'Unique name of the entity',
    type: String,
    example: 'MyEntity',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description',
    type: String,
    example: 'my plan description',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the entity is active',
    type: Boolean,
    default: true,
    example: true,
  })
  @IsBoolean()
  active: boolean = true;

  @ApiProperty({
    description: 'List of feature IDs linked to this entity',
    type: [String],
    example: ['feature_1', 'feature_2'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  featureIds: string[];
}
