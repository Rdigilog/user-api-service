import { AuthGuard } from '@app/guard/auth.guard';
import { AssignPermissionsDto, CreateItemDto } from '@app/model/role.dto';
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
import { RouteName } from 'libs/decorators/route-name.decorator';
import { RoleService } from 'packages/repository/services/role.service';

@ApiTags('Role')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@Controller('role')
export class RoleController {
  constructor(
    private readonly service: RoleService,
    private readonly responseService: ResponsesService,
  ) {}
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get('')
  @RouteName('role.list')
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

  @UseGuards(AuthGuard)
  @Post()
  @RouteName('role.create')
  async create(@Body() payload: CreateItemDto) {
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

  @UseGuards(AuthGuard)
  @Post()
  @RouteName('permission.create')
  async createPermission(@Body() payload: CreateItemDto) {
    try {
      const result = await this.service.createPermission(payload);
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

  @UseGuards(AuthGuard)
  @Patch('/:roleId')
  @Put('/:roleId')
  @RouteName('role.update')
  async update(
    @Body() payload: Partial<CreateItemDto>,
    @Param('roleId') roleId: string,
  ) {
    try {
      const result = await this.service.update(payload, roleId);
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

  @UseGuards(AuthGuard)
  @Post('/assign-permissions')
  @RouteName('role.permission.assign')
  async assingPermissions(@Body() payload: AssignPermissionsDto) {
    try {
      const result = await this.service.assignRolePermissions(payload);
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

  @Get('/permissions/:roleId')
  @RouteName('role.permission.get')
  async getRolePermissions(@Param('roleId') roleId: string) {
    try {
      const result = await this.service.rolePermissions(roleId);
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

  @Get('/permissions')
  @RouteName('permission.list')
  async getAllPermissions() {
    try {
      const result = await this.service.permissions();
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
