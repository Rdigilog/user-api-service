
import {
  Body,
  Controller,
  Get,

  Query,

} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { TermLegalType } from '@prisma/client';
import { TermLegalService } from 'src/services/term-legal.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Controller('term-legal')
export class TermLegalController {
  constructor(
    private readonly service: TermLegalService,
    private readonly responseService: ResponsesService,
  ) {}
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: TermLegalType })
  @Get('')
  async list(
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
    @Query('type') type?: TermLegalType,
  ) {
    try {
      const result = await this.service.list(
        page,
        size,
        search,
        sortBy,
        sortDirection,
        type,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
