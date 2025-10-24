import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Put,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateJobRoleDto } from 'src/models/company/job-role.dto';
import type { LoggedInUser } from 'src/models/types/user.types';
import { JobRoleService } from 'src/services/job-role.service';
import { ResponsesService } from 'src/utils/services/responses.service';

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
  @ApiOperation({ summary: 'List all job roles with pagination and search' })

  @Get()
  async list(
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.all(
        user.userRole[0].companyId as string,
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
