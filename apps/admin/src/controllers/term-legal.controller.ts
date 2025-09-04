import { AuthGuard } from '@app/guard/auth.guard';
import { CreateTermLegalDto } from '@app/model/term.legal.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { TermLegalType } from '@prisma/client';
import { TermLegalService } from 'packages/repository/services/term-legal.service';

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
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() payload: CreateTermLegalDto) {
    try {
      const result = await this.service.create(payload);
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(@Body() payload: CreateTermLegalDto, @Param('id') id: string) {
    try {
      const result = await this.service.update(payload, id);
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
  @Get('/:id')
  @UseGuards(AuthGuard)
  async view(@Param('id') id: string) {
    try {
      const result = await this.service.view(id);
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
