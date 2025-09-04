import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShiftType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRotaDto {
  @ApiProperty({
    example: '2025-06-13T00:00:00.000Z',
    description: 'Date of the shift',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: '2025-06-13T08:00:00.000Z',
    description: 'Start time of the shift',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2025-06-13T17:00:00.000Z',
    description: 'End time of the shift',
  })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({
    example: 'Covering for John',
    description: 'Optional shift notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    enum: ShiftType,
    example: ShiftType.MORNING,
    description: 'Type of the shift',
  })
  @IsEnum(ShiftType)
  shiftType: ShiftType;

  @ApiProperty({
    example: 'user_12345',
    description: 'User ID associated with the shift',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
