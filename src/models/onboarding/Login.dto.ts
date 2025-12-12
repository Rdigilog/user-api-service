import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GoogleAuthDto } from './SignUp.dto';

export class LoginDTO extends GoogleAuthDto {
  @ApiProperty({
    description: 'Foreign key to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'pass phrase to the users model',
    type: 'string',
    example: '123456789012345678', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'lOGIN TYPE FIELD',
    type: 'string',
    example: 'SOCIAL', // Adjust the example according to your expected BigInt format
  })
  @IsString()
  @IsOptional()
  type: 'SOCIAL' | 'NON_SOCIAL';

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName: string;
}
