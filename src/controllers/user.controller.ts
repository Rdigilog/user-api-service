/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  Headers,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  // ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthComapny, AuthUser } from 'src/decorators/logged-in-user-decorator';
import { RouteName } from 'src/decorators/route-name.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  UpdateProfileDto,
  EmployeeDto,
  ChangePassword,
  ChangeStatus,
} from 'src/models/onboarding/profile.dto';
import { InviteUserDTO } from 'src/models/onboarding/SignUp.dto';
import type { activeCompaany, LoggedInUser } from 'src/models/types/user.types';
import { MFASetupCompleteDTO } from 'src/models/user/mfa.dto';
import { UserService } from 'src/services/user.service';
import { OtpService } from 'src/utils/services/otp.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { UtilsService } from 'src/utils/services/utils.service';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('access-stoken') // allow using access token with swagger()
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
  @Get('')
  async companyList(
    // @Headers('X-Company-id') companyId: string, // single header
    // @AuthUser() user: LoggedInUser,
    @AuthComapny() company: activeCompaany,
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
        company.id,
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

  @Get('/profile')
  @ApiOperation({ summary: 'Fetch profile of login user' })
  async userProfile(@AuthUser() user: LoggedInUser) {
    // console.log('login user', user);
    try {
      const result = await this.service.view(user.id);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get('/:userId')
  async getUser(
    @Param('userId') userId: string,
    // @AuthUser() user: LoggedInUser,
  ) {
    try {
      // console.log(user.id);
      const result = await this.service.view(userId);
      if (result.error == 2)
        return this.responseService.notFound('no user found');

      return this.responseService.success(result.body);
    } catch (e: any) {
      return this.responseService.exception(e?.message);
    }
  }

  @Delete('/:userId')
  async archivedUser(
    @Param('userId') userId: string,
    // @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.archiveUser(userId);
      if (result.error == 2)
        return this.responseService.notFound('no user found');
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/:userId/unarchive')
  async unarchiveUser(
    @Param('userId') userId: string,
    // @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.unarchiveUser(userId);
      if (result.error == 2)
        return this.responseService.notFound('no user found');
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/profile')
  @ApiOperation({ summary: 'Update profile (with optional profile picture)' })
  async updateProfile(
    @Body() payload: UpdateProfileDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.updateProfile(payload, user.id);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @ApiOperation({ summary: 'Update profile (with optional profile picture)' })
  @Patch('/profile/:userId')
  async updateProfilewWithUserId(
    @Body() payload: UpdateProfileDto,
    @Param('userId') userId: string,
  ) {
    try {
      const result = await this.service.updateProfile(payload, userId);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('/employee/:id')
  @ApiOperation({ summary: 'Update profile (with optional profile picture)' })
  @ApiExtraModels(EmployeeDto)
  @RouteName('settings.company.update')
  async updateEmployeeInfo(
    @Body() payload: EmployeeDto,
    // @AuthUser() user: LoggedInUser,
    @Param('id') id: string,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      // const { userRole } = user;
      const result = await this.service.updateJobInformation(
        payload,
        id,
        company.id,
      );

      if (result.error === 2) {
        return this.responseService.exception(result.body);
      }

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
  // async updateProfileFull(
  //   @Body() payload: EmployeeDto,
  //   @Param('userId') userId: string,
  //   @AuthUser() user: LoggedInUser,
  // ) {
  //   try {
  //     const result = await this.service.updateJobInformation(
  //       payload,
  //       userId,
  //       user.userRole[0].companyId as string,
  //     );
  //     if (result.error == 1)
  //       return this.responseService.badRequest(result.body);
  //     if (result.error == 2) return this.responseService.exception(result.body);
  //     return this.responseService.success(result.body);
  //   } catch (e) {
  //     return this.responseService.exception(e.message);
  //   }
  // }

  @Patch('/change-password')
  async changePassword(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() payload: ChangePassword,
  ) {
    try {
      if (payload.newPassword != payload.confirmPassword) {
        return this.responseService.badRequest('Passwords do not match');
      }

      const user = await this.service.findById(loggedInUser.id, true);
      if (!user) {
        return { error: 1, body: 'No User found' };
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
        user.id,
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
    @AuthUser() user: LoggedInUser,
    @Body() payload: ChangeStatus,
    @Param('userId') userId: string,
  ) {
    try {
      const result = await this.service.updateUser(
        {
          ...payload,
        },
        userId,
      );
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post('/invite')
  async inviteUser(
    @Body() payload: InviteUserDTO,
    @AuthUser() user: LoggedInUser,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.invite(payload, company.id, user.id);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @RouteName('user.invite.retry')
  @Post('/re-invite/:inviteLink')
  async reInviteUser(
    @Headers('X-Company-id') companyId: string, // single header
    @Param('inviteLink') inviteLink: string,
    // @AuthUser() user: LoggedInUser,
    @AuthComapny() company: activeCompaany,
  ) {
    try {
      const result = await this.service.reinvite(inviteLink, company.id);
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
    @AuthComapny() company: activeCompaany,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
    // @Query('role') role?: string,
  ) {
    try {
      // const companyId = user.userRole[0]?.companyId as string;
      const result = await this.service.invites(
        company.id,
        page,
        size,
        search,
        sortBy,
        sortDirection,
        // role,
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
      // const payload = { imageUrl: null };
      const result = await this.service.removeProfilePic(user.id);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post('/mfa')
  async enableMFA(@AuthUser() loggedInUser: LoggedInUser) {
    try {
      const otpService = new OtpService();
      const result = await otpService.generateSecret(
        loggedInUser.email as string,
      );

      if (result == null)
        return this.responseService.exception('something went wrong');

      const qrcode = await otpService.generateQRCode(result.secret.otpauth_url);
      return this.responseService.success({
        secret: result.base32,
        data: {
          otpauth_url: result.otpauth_url,
          qrCode: qrcode,
          token: result.base32,
        },
      });
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Put('/mfa')
  async completeMFAsetup(
    @AuthUser() loggedInUser: LoggedInUser,
    @Body() payload: MFASetupCompleteDTO,
  ) {
    try {
      const verify = await new OtpService().isTokenValid(
        payload.secret,
        payload.code,
      );

      if (!verify) {
        return this.responseService.badRequest('Invalid OTP');
      }

      const result = await this.service.updateUser(
        {
          mfaEnabled: true,
          mfaSecret: payload.secret,
        },
        loggedInUser.id,
      );
      if (result.error == 1)
        return this.responseService.badRequest('No Record found');
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success('MFA enabled successfully');
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Delete('/mfa')
  async disableMFA(@AuthUser() loggedInUser: LoggedInUser) {
    try {
      const result = await this.service.updateUser(
        {
          mfaEnabled: false,
          mfaSecret: '',
        },
        loggedInUser.id,
      );
      if (result.error == 1)
        return this.responseService.badRequest('No Record found');
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success('MFA disabled successfully');
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
