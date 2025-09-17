import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TermLegalType } from '@prisma/client';

export class CreateTermLegalDto {
  @ApiProperty({
    description: 'Title of the term or legal item',
    example: 'Privacy Policy',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Full content of the term or legal item',
    example: 'This is the privacy policy content...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Type of the item',
    enum: TermLegalType,
    default: TermLegalType.TERM,
  })
  @IsEnum(TermLegalType)
  type: TermLegalType = TermLegalType.TERM;
}
