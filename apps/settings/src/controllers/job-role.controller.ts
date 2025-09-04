import { AuthGuard } from '@app/guard/auth.guard';
import { CreateJobRoleDto } from '@app/model/company/job-role.dto';
import { LoggedInUser } from '@app/model/types/user.types';
import { ResponsesService } from '@app/utils/services/responses.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'libs/decorators/logged-in-user-decorator';
import { RouteName } from 'libs/decorators/route-name.decorator';
import { JobRoleService } from 'packages/repository/services/job-role.service';

@Controller('job-role')
@ApiTags('Job Role')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class JobRoleController {
  constructor(
    private readonly service: JobRoleService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('job-role.list')
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

  @RouteName('job-role.create')
  @Post()
  async create(
    @AuthUser() user: LoggedInUser,
    @Body() payload: CreateJobRoleDto,
  ) {
    try {
      const result = await this.service.create(
        payload,
        user.userRole[0].companyId,
      );
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

  @RouteName('job-role.update')
  @Patch('/:jobRoleId')
  @Put('/:jobRoleId')
  async update(
    @AuthUser() user: LoggedInUser,
    @Body() payload: Partial<CreateJobRoleDto>,
    @Param('jobRoleId') id: string,
  ) {
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
}
