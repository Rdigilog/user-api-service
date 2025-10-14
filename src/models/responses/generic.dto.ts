import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'SUCCESSFUL' })
  message: string;

  @ApiProperty({
    description: 'Response data (dynamic type)',
  })
  data: T;
}
