import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({
    description: 'pass phrase to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'lOGIN TYPE FIELD',
    type: 'string',
    example: 'SOCIAL', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsOptional()
  type?: 'SOCIAL' | 'NON_SOCIAL';
}
