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
export class PaginatedResponse<T> {
  @ApiProperty({ example: 1 })
  totalItems: number;

  @ApiProperty({ example: 1 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  // This property will be dynamically replaced in the factory function
  result: T[];
}
