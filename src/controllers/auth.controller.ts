
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginDTO } from 'src/models/onboarding/Login.dto';
import { InitiateRegistrationDto, PhoneNumberDTO, UserOtpVerification, CompanyDetailsDTO, UsernameDTO, resetPasswordDTO } from 'src/models/onboarding/SignUp.dto';
import { UserService } from 'src/services/user.service';
import { OtpService } from 'src/utils/services/otp.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { UtilsService } from 'src/utils/services/utils.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../config/config.keys';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponsesService,
    private readonly jwtService: JwtService,
    private readonly utilService: UtilsService,
    private readonly configService: ConfigService
  ) { }
  @Post('/initiate')
  async create(@Body() payload: InitiateRegistrationDto) {
    try {
      let result = {
        error: 1,
        body: 'This signup option not functional yet',
      };
      if (payload.type == 'NON_SOCIAL') {
        result = await this.userService.createAccount(payload);
      }
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token') // allow using access token with swagger()
  @Post('/phone-number')
  async verifyPhoneNumber(@Body() payload: PhoneNumberDTO, @Request() req) {
    try {
      try {
        await this.userService.findByUsername(payload.phoneNumber);
        return this.responseService.badRequest(`Phone Number ${payload.phoneNumber} already tied to another account`)
      } catch (e) {

      }

      const result = await this.userService.addPhoneNumber(
        payload,
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

  @Post('/verify-otp')
  async otp(@Body() requestBody: UserOtpVerification) {
    try {
      const result = await this.userService.findByUsername(
        requestBody.username,
      );
      if (!result) {
        return this.responseService.notFound('User not found');
      }

      const isValid = await new OtpService().isTokenValid(
        requestBody.token,
        requestBody.code,
      );
      if (isValid) {
        const payload = {
          sub: result.id,
          email: result.email,
          phoneNumber: result.phoneNumber,
        };
        const update: any = {};
        if (requestBody.username == result.phoneNumber) {
          update.phoneVerified = true;
        }
        if (requestBody.username == result.email) {
          update.verified = true;
        }
        update.active = true
        await this.userService.updateUser(update, result.id);
        const userInfo = await this.userService.findById(result.id);
        const token = await this.jwtService.signAsync(payload);
        return this.responseService.success({
          access_token: token,
          expires_in: this.configService.get<string>(CONFIG_KEYS.JWT_EXPIRATION_TIME),
          user_info: userInfo,
        });
      } else {
        return this.responseService.unauthorized('Invalid OTP');
      }
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token') // allow using access token with swagger()
  @Post('/company-details')
  async addCompanyDetails(@Body() payload: CompanyDetailsDTO, @Request() req) {
    try {
      const result = await this.userService.addCompanyDetails(
        payload,
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

  @Post('login')
  async login(@Body() requestBody: LoginDTO) {
    try {
      const result = await this.userService.findByUsername(
        requestBody.username,
      );
      if (!result) {
        return this.responseService.unauthorized('Invalid username/password');
      }
      if (!result.active) {
        return this.responseService.unauthorized('Account not activated yet');
      }
      if (result.deleted) {
        return this.responseService.unauthorized('No Records found');
      }

      if (requestBody.password) {
        const isMatch = await this.utilService.comparePassword(
          requestBody.password,
          result.password,
        );
        if (isMatch) {
          const payload = {
            sub: result.id,
            username: result.email,
          };
          const userInfo = await this.userService.findById(result.id);
          const token = await this.jwtService.signAsync(payload);
          return this.responseService.success({
            access_token: token,
            expiresIn: this.configService.get<string>(CONFIG_KEYS.JWT_EXPIRATION_TIME),
            user_info: userInfo,
          });
        } else {
          return this.responseService.unauthorized('Invalid username/Password');
        }
      }
      await this.processOtp(requestBody.username, result);
      return this.responseService.success(
        `OTP sent to ${requestBody.username}`,
      );
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @Post('resend-otp')
  async resentOtp(@Body() requestBody: UsernameDTO) {
    try {
      const result = await this.userService.findByUsername(
        requestBody.username,
      );
      if (!result) {
        return this.responseService.unauthorized('Invalid username/password');
      }
      if (result.deleted) {
        return this.responseService.unauthorized('No Records found');
      }
      return this.processOtp(requestBody.username, result);
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() requestBody: UsernameDTO) {
    try {
      const result = await this.userService.findByUsername(
        requestBody.username,
      );
      if (!result) {
        return this.responseService.unauthorized('Invalid username/password');
      }
      if (!result.active) {
        return this.responseService.unauthorized('Account not activated yet');
      }
      if (result.deleted) {
        return this.responseService.unauthorized('No Records found');
      }
      return this.processOtp(requestBody.username, result);
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() requestBody: resetPasswordDTO) {
    try {
      const user = await this.userService.findByUsername(requestBody.email);
      if (!user) {
        return this.responseService.notFound('User not found');
      }

      const isTokenValid = new OtpService().isTokenValid(
        requestBody.token,
        requestBody.code,
      );

      if (!isTokenValid) {
        return this.responseService.unauthorized('Invalid token or code');
      }
      requestBody.password = await new UtilsService().hashPassword(
        requestBody.password,
        10,
      ) || requestBody.password;
      const userData = { password: requestBody.password, active: true };
      const result = await this.userService.updateUser(userData, user.id);
      if (result.error == 1)
        return this.responseService.badRequest(result.body);
      if (result.error == 2) return this.responseService.exception(result.body);
      return this.responseService.success('Password reset successfully');
    } catch (e) {
      // console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @Post('password-reset/verify-otp')
  async passwordResetVerifyOtp(@Body() payload: UserOtpVerification) {
    try {
      const result = await this.userService.findByUsername(payload.username);
      if (!result) {
        return this.responseService.notFound('User not found');
      }

      const isValid = await new OtpService().isTokenValid(
        payload.token,
        payload.code,
      );
      if (isValid) {
        return this.responseService.success('Otp Verified Successfully');
      } else {
        return this.responseService.unauthorized('Invalid OTP');
      }
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  async processOtp(username: string, user: User) {
    if (username == user.phoneNumber) {
      const response = await this.userService.sendOtpPhone(username);
      if (response.error != 0)
        return this.responseService.exception('Failed to send OTP');
      return this.responseService.success(response.body);
    }

    if (username == user.email) {
      const response = await this.userService.sendOtp(username);
      if (response.error != 0)
        return this.responseService.exception('Failed to send OTP');
      return this.responseService.success(response.body);
    }

    return this.responseService.badRequest(
      'Otp recipient needs to be either phone or email',
    );
  }
}
