import { IsEmail, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDEMODto {
  @ApiProperty({
    example: '+2347012345678',
    description: 'Phone number of the user',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'example@email.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '2025-06-20T15:30:00.000Z',
    description: 'Date the booking is scheduled for',
  })
  @IsDateString()
  bookedDate: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the user booking' })
  @IsString()
  name: string;
}
