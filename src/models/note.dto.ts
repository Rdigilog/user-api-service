import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiPropertyOptional({
    example: 'FinTech',
    description: 'Company Industry i.e FinTech Agriculture etc',
  })
  @IsString()
  content!: string;
}
