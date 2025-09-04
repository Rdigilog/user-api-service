import { AuthGuard } from '@app/guard/auth.guard';
import { LoggedInUser } from '@app/model/types/user.types';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthUser } from 'libs/decorators/logged-in-user-decorator';
import { RouteName } from 'libs/decorators/route-name.decorator';
import { EmployeeService } from 'packages/repository/services/employee.service';

@Controller('employee')
@ApiTags('Employee')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(
    private readonly service: EmployeeService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('employee.list')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get('')
  async list(
    @AuthUser() user: LoggedInUser,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const result = await this.service.list(
        user.userRole[0].companyId,
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
}
