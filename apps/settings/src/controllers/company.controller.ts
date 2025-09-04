import { BreakComplianceSettingDto, CompanyUpdateDto, DigiTimeSettingDto, HolidayRequestRuleSettingDto, ShiftSettingDto } from '@app/model/company/company.dto';
import { LoggedInUser } from '@app/model/types/user.types';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthUser } from 'libs/decorators/logged-in-user-decorator';
import { CompanyService } from 'packages/repository/services/company.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RouteName } from 'libs/decorators/route-name.decorator';
import { AuthGuard } from '@app/guard/auth.guard';
import { CreateRotaRuleSettingDto } from '@app/model/company/rota-rule.dto';

@ApiTags('Company')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(
    private readonly service: CompanyService,
    private readonly responseService: ResponsesService,
  ) {}

  @ApiExtraModels(CompanyUpdateDto)
  @RouteName('settings.company.update')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CompanyUpdateDto) }, // pull in DTO schema
        {
          type: 'object',
          properties: {
            banner: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @Patch('')
  async updateCompany(
    @Body() payload: CompanyUpdateDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.update(
        payload,
        user.userRole[0].companyId,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get()
  async company(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getcompany(user.userRole[0].companyId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  @Patch('shift')
  async updateCompanyShiftSetting(
    @Body() payload: ShiftSettingDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setShiftSetting(
        payload,
        user.userRole[0].companyId,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get("shift")
  async companyShiftSetting(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getShiftSetting(user.userRole[0].companyId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  @Patch('rota-rule')
  async updateCompanyRotaRule(
    @Body() payload: CreateRotaRuleSettingDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setRotaRule(
        payload,
        user.userRole[0].companyId,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get("rota-rule")
  async companyRotaRule(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getRotaRule(user.userRole[0].companyId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  
  @Patch('digi-time')
  async updateDigiTimeSetting(
    @Body() payload: DigiTimeSettingDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setDigiTimetSetting(
        payload,
        user.userRole[0].companyId,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get("digi-time")
  async companyDigiTimeSetting(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getDigiTimetSetting(user.userRole[0].companyId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  @Patch('holiday-request')
  async updateHolidayRequest(
    @Body() payload: HolidayRequestRuleSettingDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setHolidayRequestSetting(
        payload,
        user.userRole[0].companyId,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get("holiday-request")
  async companyHolidayRequest(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getHolidayRequestSetting(user.userRole[0].companyId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  @Patch('breaks')
  async updateBreaks(
    @Body() payload: BreakComplianceSettingDto,
    @AuthUser() user: LoggedInUser,
  ) {
    try {
      const result = await this.service.setBreaks(
        payload,
        user.userRole[0].companyId,
      );
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Get("breaks")
  async companyBreaks(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.getBreaks(user.userRole[0].companyId);
      if (result.error == 2) return this.responseService.exception(result.body);

      if (result.error == 1)
        return this.responseService.badRequest(result.body);

      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
