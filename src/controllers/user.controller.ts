
import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Request,
  Body,
  Query,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateProfileDto, EmployeeDto, ChangePassword, ChangeStatus } from 'src/models/onboarding/profile.dto';
import { InviteUserDTO } from 'src/models/onboarding/SignUp.dto';
import type { LoggedInUser } from 'src/models/types/user.types';
import { UserService } from 'src/services/user.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { UtilsService } from 'src/utils/services/utils.service';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly responseService: ResponsesService,
    private readonly utilService: UtilsService,
  ) {}

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @Get('/list')
  async list(
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
    @Query('role') role?: string,
  ) {
    try {
      const result = await this.service.list(
        page,
        size,
        search,
        sortBy,
        sortDirection,
        role,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @ApiHeader({
    name: 'X-Company-id',
    description: 'A Company tenant Id',
    required: true,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @Get('/list/company')
  async companyList(
    @Headers('X-Company-id') companyId: string, // single header
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
    @Query('role') role?: string,
  ) {
    try {
      const result = await this.service.companyList(
        page,
        size,
        search,
        sortBy,
        sortDirection,
        companyId,
        role,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('')
  async getUser(@Request() req) {
    return this.responseService.success(req.user);
  }

  // @Patch()
  // async updateUser(@Body() payload: UserDTO, @Request() req) {
  //   try {
  //     const result = await this.service.updateUser(payload, req.user.id);
  //     if (result.error == 1)
  //       return this.responseService.badRequest(result.body);
  //     if (result.error == 2) return this.responseService.exception(result.body);
  //     return this.responseService.success(result.body);
  //   } catch (e) {
  //     return this.responseService.exception(e.message);
  //   }
  // }

  @Patch('/prifle')
  @ApiOperation({ summary: 'Update profile (with optional profile picture)' })
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john@example.com' },
        phoneNumber: { type: 'string', example: '+123456789' },
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateProfile(
    @Body() payload: UpdateProfileDto,
    @UploadedFile() profilePicture: Express.Multer.File,
    @Request() req,
  ) {
    try {
      const result = await this.service.updateProfile(
        payload,
        profilePicture,
        req.user.id,
      );
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/prifle/:userId')
  @ApiOperation({ summary: 'Update profile (with optional profile picture)' })
  async updateProfileFull(
    @Body() payload: EmployeeDto,
    @Param('userId') userId: string,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.updateJobInformation(
        payload,
        userId,
        user.userRole[0].companyId as string,
      );
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/change-password')
  async changePassword(@Request() req, @Body() payload: ChangePassword) {
    try {
      if (payload.newPassword != payload.confirmPassword) {
        return this.responseService.badRequest('Passwords do not match');
      }

      const user = await this.service.findById(req.user.id, true);
      if(!user){
        return {error:1, body:"No User found"}
      }
      const passwordMatch = await this.utilService.comparePassword(
        payload.password,
        user.password,
      );
      if (!passwordMatch) {
        return this.responseService.badRequest('Old password is incorrect');
      }
      const hashPassword = await this.utilService.hashPassword(
        payload.newPassword,
        10,
      );
      const result = await this.service.updateUser(
        { password: hashPassword },
        req.user.id,
      );
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success('User Password changed successfully');
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/change-status/:userId')
  async changeStatus(
    @Request() req,
    @Body() payload: ChangeStatus,
    @Param('userId') userId: string,
  ) {
    try {
      const result = await this.service.updateUser(payload, userId);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success('User Status changed successfully');
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post('/invite')
  async inviteUser(
    @Body() payload: InviteUserDTO,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.invite(
        payload,
        user.userRole[0]?.companyId as string,
        user.id,
      );
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('user.invite.retry')
  @Post('/re-invite//:inviteLink')
  async reInviteUser(
    @Headers('X-Company-id') companyId: string, // single header
    @Param('inviteLink') inviteLink: string,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.reinvite(
        inviteLink,
        user.userRole[0]?.companyId as string,
      );
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('User.invite.list.company')
  @Get('invite')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  async invites(
    @AuthUser() user: LoggedInUser,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
    @Query('role') role?: string,
  ) {
    try {
      const companyId = user.userRole[0]?.companyId as string;
      const result = await this.service.invites(
        companyId,
        page,
        size,
        search,
        sortBy,
        sortDirection,
        role,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Delete('profile/picture')
  async removeProfilePic(@AuthUser() user: LoggedInUser) {
    try {
      const payload = { imageUrl: null };
      const result = await this.service.removeProfilePic(user.id);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
