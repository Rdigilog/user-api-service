import { AuthGuard } from '@app/guard/auth.guard';
import {
  AssignBranchUserDto,
  CreateBranchDto,
} from '@app/model/branch/branch.dto';
import { LoggedInUser } from '@app/model/types/user.types';
import { ResponsesService } from '@app/utils/services/responses.service';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Body,
  Post,
  Patch,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'libs/decorators/logged-in-user-decorator';
import { RouteName } from 'libs/decorators/route-name.decorator';
import { BranchService } from 'packages/repository/services/branch.service';

@ApiTags('Branch')
@Controller('branch')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class BranchController {
  constructor(
    private readonly service: BranchService,
    private readonly responseService: ResponsesService,
  ) {}

  @RouteName('branch.list')
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

  @RouteName('branch.create')
  @Post()
  async create(@Request() req, @Body() payload: CreateBranchDto) {
    try {
      const result = await this.service.create(payload, req.user.company.id);
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

  @RouteName('branch.assign')
  @Patch(':branchId/assign')
  async assignToBranch(
    @Body() payload: AssignBranchUserDto,
    @Param('branchId') branchId: string,
  ) {
    try {
      const result = await this.service.assingToBranch(payload, branchId);
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

  @RouteName('branch.unassign')
  @Delete(':branchId/unassign')
  async removeFromBranch(
    @Body() payload: AssignBranchUserDto,
    @Param('branchId') branchId: string,
  ) {
    try {
      const result = await this.service.removeFromBranch(payload, branchId);
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

  @RouteName('branch.update')
  @Patch('/:branchId')
  @Put('/:branchId')
  async update(
    @Body() payload: Partial<CreateBranchDto>,
    @Param('branchId') id: string,
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
