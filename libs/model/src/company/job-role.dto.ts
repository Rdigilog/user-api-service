import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateJobRoleDto {
  @ApiProperty({ type: String, example: 'Urgent' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: '#FF0000' })
  @IsString()
  color: string;
}
