/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  // ConsoleLogger,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginDTO } from 'src/models/onboarding/Login.dto';
import {
  InitiateRegistrationDto,
  PhoneNumberDTO,
  UserOtpVerification,
  CompanyDetailsDTO,
  UsernameDTO,
  resetPasswordDTO,
  SocialLoginRequest,
} from 'src/models/onboarding/SignUp.dto';
import { UserService } from 'src/services/user.service';
import { OtpService } from 'src/utils/services/otp.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { UtilsService } from 'src/utils/services/utils.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../config/config.keys';
import { ApiResponseDto } from 'src/models/responses/generic.dto';
import { AuthResponseDto, TokenDataDto } from 'src/models/responses/Login.dto';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import type { LoggedInUser } from 'src/models/types/user.types';
import * as admin from 'firebase-admin';
import { FirebaseAuthError } from 'node_modules/firebase-admin/lib/utils/error';
// import { FirebaseAuthError } from 'firebase-admin/lib/utils/error'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: typeof admin,
    private readonly userService: UserService,
    private readonly responseService: ResponsesService,
    private readonly jwtService: JwtService,
    private readonly utilService: UtilsService,
    private readonly configService: ConfigService,
  ) {}

  @ApiExtraModels(ApiResponseDto, TokenDataDto)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TokenDataDto) },
          },
        },
      ],
    },
  })
  @Post('/signup')
  async create(@Body() payload: InitiateRegistrationDto) {
    try {
      let result: { error: number; body: any } = {
        error: 1,
        body: 'This signup option not functional yet',
      };

      if (payload.type == 'SOCIAL') {
        if (!payload.idToken)
          return this.responseService.badRequest(
            'No token provided for social logi',
          );

        const result = await this.validateToken(payload.idToken);

        const responseResult = await this.userService.socialAuth(result);

        if (responseResult) {
          const userInfo = await this.userService.findById(responseResult.id);

          const jwtPayload = {
            sub: responseResult.id,
            email: responseResult.email,
            phoneNumber: responseResult.phoneNumber,
          };

          const token = await this.jwtService.signAsync(jwtPayload);

          return this.responseService.success({
            access_token: token,
            expires_in: this.configService.get<string>(
              CONFIG_KEYS.JWT_EXPIRATION_TIME,
            ),
            user_info: userInfo,
          });
        } else {
          return this.responseService.exception(
            'Login failed pls try again later',
          );
        }
      }

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

  @ApiExtraModels(ApiResponseDto, TokenDataDto)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TokenDataDto) },
          },
        },
      ],
    },
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token') // allow using access token with swagger()
  @Post('/phone-number')
  async verifyPhoneNumber(@Body() payload: PhoneNumberDTO, @Request() req) {
    try {
      const phoneNumber = this.utilService.normalizeInput(payload.phoneNumber);
      try {
        await this.userService.findByUsername(phoneNumber);
        return this.responseService.badRequest(
          `Phone Number ${phoneNumber} already tied to another account`,
        );
      } catch (e) {
        Logger.log('NO RECORDS FOUND SO PROCEED PLS');
      }

      const result = await this.userService.addPhoneNumber(
        { phoneNumber: phoneNumber },
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

  @ApiExtraModels(ApiResponseDto, AuthResponseDto)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(AuthResponseDto) },
          },
        },
      ],
    },
  })
  @Post('/verify-otp')
  async otp(@Body() requestBody: UserOtpVerification) {
    try {
      const phoneNumber = this.utilService.normalizeInput(requestBody.username);
      try {
        try {
          const result = await this.userService.findByUsername(phoneNumber);
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
            update.active = true;
            await this.userService.updateUser(update, result.id);
            const userInfo = await this.userService.findById(result.id);
            const token = await this.jwtService.signAsync(payload);
            return this.responseService.success({
              access_token: token,
              expires_in: this.configService.get<string>(
                CONFIG_KEYS.JWT_EXPIRATION_TIME,
              ),
              user_info: userInfo,
            });
          } else {
            return this.responseService.unauthorized('Invalid OTP');
          }
        } catch (e) {
          return this.responseService.unauthorized('invalid username');
        }
      } catch (e) {
        return this.responseService.unauthorized('invalid username');
      }
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token') // allow using access token with swagger()
  @Post('/company-details')
  async addCompanyDetails(
    @Body() payload: CompanyDetailsDTO,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.userService.addCompanyDetails(
        payload,
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

  @ApiExtraModels(ApiResponseDto, AuthResponseDto)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(AuthResponseDto) },
          },
        },
      ],
    },
  })
  @Post('login')
  async login(@Body() requestBody: LoginDTO) {
    try {
      let result: User | null;

      if (requestBody.type == 'SOCIAL') {
        // if (!requestBody.idToken)
        //   return this.responseService.badRequest(
        //     'No token provided for social logi',
        //   );
        // const result = await this.validateToken(requestBody.idToken);
        // const responseResult = await this.userService.socialAuth(result);
        // if (responseResult) {
        //   const userInfo = await this.userService.findById(responseResult.id);
        //   const jwtPayload = {
        //     sub: responseResult.id,
        //     email: responseResult.email,
        //     phoneNumber: responseResult.phoneNumber,
        //   };
        //   const token = await this.jwtService.signAsync(jwtPayload);
        //   return this.responseService.success({
        //     access_token: token,
        //     expires_in: this.configService.get<string>(
        //       CONFIG_KEYS.JWT_EXPIRATION_TIME,
        //     ),
        //     user_info: userInfo,
        //   });
        // } else {
        //   return this.responseService.exception(
        //     'Login failed pls try again later',
        //   );
        // }
      }

      try {
        const username = this.utilService.normalizeInput(
          requestBody.username as string,
        );
        console.log(username);
        result = await this.userService.findByUsername(username);
      } catch (e) {
        console.log(e);
        return this.responseService.unauthorized('invalid username/password');
      }
      if (result.deleted) {
        return this.responseService.unauthorized('No Records found');
      }

      if (!result.active || !requestBody.password) {
        return this.processOtp(requestBody.username as string, result);
      }

      const isMatch = await this.utilService.comparePassword(
        requestBody.password,
        result.password,
      );
      if (isMatch) {
        const userInfo = await this.userService.findById(result.id);
        if (userInfo?.userRole.some((r) => r.role.name == 'SUPER_ADMIN')) {
          return this.processOtp(requestBody.username as string, result);
        }

        if (result.mfaEnabled) {
          return this.responseService.success({
            token: result.mfaSecret,
          });
        }
        const payload = {
          sub: result.id,
          username: result.email,
        };
        const token = await this.jwtService.signAsync(payload);
        return this.responseService.success({
          access_token: token,
          expiresIn: this.configService.get<string>(
            CONFIG_KEYS.JWT_EXPIRATION_TIME,
          ),
          user_info: userInfo,
        });
      } else {
        return this.responseService.unauthorized('Invalid username/Password');
      }
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @ApiExtraModels(ApiResponseDto, TokenDataDto)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TokenDataDto) },
          },
        },
      ],
    },
  })
  @Post('resend-otp')
  async resentOtp(@Body() requestBody: UsernameDTO) {
    try {
      const username = this.utilService.normalizeInput(requestBody.username);

      try {
        const result = await this.userService.findByUsername(username);
        if (result.deleted) {
          return this.responseService.unauthorized('No Records found');
        }
        return this.processOtp(username, result);
      } catch (e) {
        return this.responseService.unauthorized('Invalid username/password');
      }
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @ApiExtraModels(ApiResponseDto, TokenDataDto)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TokenDataDto) },
          },
        },
      ],
    },
  })
  @Post('forgot-password')
  async forgotPassword(@Body() requestBody: UsernameDTO) {
    const username = this.utilService.normalizeInput(requestBody.username);

    try {
      try {
        const result = await this.userService.findByUsername(
          requestBody.username,
        );
        // if (!result) {
        //   return this.responseService.unauthorized('Invalid username/password');
        // }
        if (!result.active) {
          return this.responseService.unauthorized('Account not activated yet');
        }
        if (result.deleted) {
          return this.responseService.unauthorized('No Records found');
        }
        return this.processOtp(requestBody.username, result);
      } catch (e) {
        return this.responseService.unauthorized('invalid username ');
      }
    } catch (e) {
      console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @ApiExtraModels(ApiResponseDto, String)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(String) },
          },
        },
      ],
    },
  })
  @Post('reset-password')
  async resetPassword(@Body() requestBody: resetPasswordDTO) {
    try {
      try {
        const user = await this.userService.findByUsername(requestBody.email);
        const isTokenValid = new OtpService().isTokenValid(
          requestBody.token,
          requestBody.code,
        );

        if (!isTokenValid) {
          return this.responseService.unauthorized('Invalid token or code');
        }
        requestBody.password =
          (await new UtilsService().hashPassword(requestBody.password, 10)) ||
          requestBody.password;
        const userData = { password: requestBody.password, active: true };
        const result = await this.userService.updateUser(userData, user.id);
        if (result.error == 1)
          return this.responseService.badRequest(result.body);
        if (result.error == 2)
          return this.responseService.exception(result.body);
        return this.responseService.success('Password reset successfully');
      } catch (e) {
        return this.responseService.unauthorized('invalid username');
      }
    } catch (e) {
      // console.log(e);
      return this.responseService.exception(e.message);
    }
  }

  @ApiExtraModels(ApiResponseDto, String)
  @ApiOkResponse({
    description: 'Token generated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(String) },
          },
        },
      ],
    },
  })
  @Post('password-reset/verify-otp')
  async passwordResetVerifyOtp(@Body() payload: UserOtpVerification) {
    try {
      try {
        const result = await this.userService.findByUsername(payload.username);
      } catch (e) {
        return this.responseService.notFound('User not found');
      }
      // if (!result) {
      // }

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

  @Get('accept-invite/:inviteCode')
  async acceptInvite(@Param('inviteCode') inviteCode: string) {
    try {
      const result = await this.userService.acceptInvite(inviteCode);
      if (result.error == 1) {
        return this.responseService.badRequest(result.body);
      }

      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }

      return this.responseService.success(result.body);
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

  async validateToken(idToken: string) {
    try {
      const result = await this.firebaseAdmin.auth().verifyIdToken(idToken);
      const names = this.utilService.splitFullName(result.name);
      const requestBody: SocialLoginRequest = {
        provider: result.firebase.sign_in_provider,
        email: result.email || '',
        providerId: result.uid,
        firstName: names.firstName,
        lastName: names.lastName,
      };
      return requestBody;
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        console.error(error.code, error.message);
      }
      throw error;
    }
  }
}
