
import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteName } from 'src/decorators/route-name.decorator';
import { PlanService } from 'src/enums/plan.service';
import { ResponsesService } from 'src/utils/services/responses.service';


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

  @Get('feature')
  @ApiOperation({ summary: 'Get all features (paginated)' })
  @ApiResponse({ status: 200, description: 'List of features with pagination' })
  async all(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('search') search = '',
    @Query('sortBy') sortBy = 'updatedAt',
    @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    const result = this.service.all(
      Number(page),
      Number(size),
      search,
      sortBy,
      sortDirection,
    );
  }
}
