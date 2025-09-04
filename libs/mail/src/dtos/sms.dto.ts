import { IsNotEmpty, IsString } from 'class-validator';

export class SMSDto {
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  content: any;
}
