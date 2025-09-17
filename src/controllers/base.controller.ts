
import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RouteName } from 'src/decorators/route-name.decorator';
import { PlanService } from 'src/enums/plan.service';
import { BaseService } from 'src/services/base.service';
import { RoleService } from 'src/services/role.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { UtilsService } from 'src/utils/services/utils.service';

@ApiTags('Base')
@Controller('base')
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
    private readonly responseService: ResponsesService,
    private readonly utilService: UtilsService,
    private readonly planService: PlanService,
    private readonly roleService: RoleService,
  ) {}
  @Get('country')
  @RouteName('base.country')
  async getCountries() {
    try {
      const result = await this.baseService.countries();
      if (result.error == 1) return this.responseService.notFound(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get(':country_code/state')
  @RouteName('base.country.state')
  async getStatesByCountry(
    @Param('countryCode') countryCode: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const { offset, limit } = await this.utilService.pagination(page, size);
      const result = await this.baseService.getByCountry(
        countryCode,
        limit,
        offset,
        sortDirection,
        sortBy,
      );
      if (result.error == 1)
        return this.responseService.notFound('No Records found');
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get('country/paginated')
  @RouteName('base.country.paginated')
  async getCountriesPaginated(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const { offset, limit } = await this.utilService.pagination(page, size);
      const result = await this.baseService.getCountriesPaginated(
        limit,
        offset,
        sortDirection,
        sortBy,
        search,
      );
      if (result.error == 1) return this.responseService.notFound(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      const pagedCountry = await this.utilService.pagingData(
        result.body,
        page,
        limit,
      );
      return this.responseService.success(pagedCountry);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('plans')
  @RouteName('base.plans')
  async basePlans() {
    try {
      const result = await this.planService.list();
      if (result.error == 1) return this.responseService.notFound(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('roles')
  @RouteName('base.roles')
  async baseRoles() {
    try {
      const result = await this.roleService.list();
      if (result.error == 1) return this.responseService.notFound(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
