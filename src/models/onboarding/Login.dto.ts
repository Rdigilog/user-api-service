/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GoogleAuthDto } from './SignUp.dto';

export class LoginDTO extends GoogleAuthDto {
  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '123456789012345678', // string representation of BigInt
  })
  @IsString()
  @ValidateIf((o) => o.type === 'NON_SOCIAL')
  @IsNotEmpty({ message: 'username is required for NON_SOCIAL login' })
  username?: string;

  @ApiProperty({
    description: 'pass phrase to the users model',
    type: 'string',
    example: 'StrongPass123!',
  })
  @IsString()
  @ValidateIf((o) => o.type === 'NON_SOCIAL')
  @IsNotEmpty({ message: 'password is required for NON_SOCIAL login' })
  password?: string;

  @ApiProperty({
    description: 'LOGIN TYPE FIELD',
    type: 'string',
    example: 'SOCIAL',
  })
  @IsString()
  @IsNotEmpty()
  type: 'SOCIAL' | 'NON_SOCIAL';
}
