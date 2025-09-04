import { PlanDto } from '@app/model/plans/plan.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RouteName } from 'libs/decorators/route-name.decorator';
import { PlanService } from 'packages/repository/services/plan.service';

@Controller('plan')
@ApiTags('Plans')
export class PlanController {
  constructor(
    private readonly service: PlanService,
    private readonly responseService: ResponsesService,
  ) {}
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get('')
  @RouteName('plan.list')
  async list(
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const result = await this.service.all(
        page,
        size,
        search,
        sortBy,
        sortDirection,
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
  @RouteName('plan.create')
  async create(payload: PlanDto) {
    try {
      const result = await this.service.create(payload);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/:planId')
  @RouteName('plan.update')
  async update(@Body() payload: PlanDto, @Param('planId') planId: string) {
    try {
      const result = await this.service.update(payload, planId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
