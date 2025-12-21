import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MFASetupCompleteDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  secret: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;
}
