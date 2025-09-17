import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Min } from 'class-validator';

export class CreateRotaRuleSettingDto {
  @ApiProperty({ type: Boolean, default: false, example: true })
  @IsBoolean()
  allowMemberSwapShifts: boolean;

  @ApiProperty({
    type: Number,
    example: 4,
    description: 'Minimum shift duration in hours',
  })
  @IsInt()
  @Min(1)
  minShiftDuration: number;

  @ApiProperty({
    type: Number,
    example: 12,
    description: 'Maximum shift duration in hours',
  })
  @IsInt()
  @Min(1)
  maxShiftDuration: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Minimum time between shifts in hours',
  })
  @IsInt()
  @Min(0)
  minTimeBetweenShifts: number;

  @ApiProperty({
    type: Number,
    example: 6,
    description: 'Maximum consecutive workdays',
  })
  @IsInt()
  @Min(1)
  maxConsecutiveWorkdays: number;

  @ApiProperty({
    type: Number,
    example: 40,
    description: 'Maximum weekly hours per employee',
  })
  @IsInt()
  @Min(0)
  maxWeeklyHoursPerEmployee: number;

  @ApiProperty({
    type: Number,
    example: 20,
    description: 'Minimum weekly hours per employee',
  })
  @IsInt()
  @Min(0)
  minWeeklyHoursPerEmployee: number;
}
