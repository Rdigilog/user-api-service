import { PrismaService } from '@app/config/services/prisma.service';
import { BreakComplianceSettingDto, CompanyUpdateDto, DigiTimeSettingDto, HolidayRequestRuleSettingDto, RotaRuleSettingDto, ShiftSettingDto } from '@app/model/company/company.dto';
import { CreateRotaRuleSettingDto } from '@app/model/company/rota-rule.dto';
import { GeneralService } from '@app/utils/services/general.service';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';

type RangeType = 'day' | 'week' | 'month' | 'year';
@Injectable()
export class CompanyService extends PrismaService {
  constructor(
    private readonly responseService: ResponsesService,
    private readonly generalService: GeneralService,
  ) {
    super();
  }
  async dashboardSummary(companyId: string, range: RangeType) {
    try {
      // const result = await this.$transaction(
      //   async (tx) => {
      //     const dateRange = this.generalService.getDateRange(range); // 'day', 'week', etc.
      //     const currentStart = format(dateRange.currentStartDate, 'yyyy-MM-dd');
      //     const currentEnd = format(dateRange.currentEndDate, 'yyyy-MM-dd');
      //     const previousStart = format(
      //       dateRange.previousStartDate,
      //       'yyyy-MM-dd',
      //     );
      //     const previousEnd = format(dateRange.previousEndDate, 'yyyy-MM-dd');
      //     const current = await tx.attendance.groupBy({
      //       by: ['status'],
      //       where: {
      //         date: {
      //           gte: currentStart,
      //           lte: currentEnd,
      //         },
      //         companyId,
      //       },
      //     });
      //     const previous = await tx.attendance.groupBy({
      //       by: ['status'],
      //       where: {
      //         date: {
      //           gte: currentStart,
      //           lte: currentEnd,
      //         },
      //         companyId,
      //       },
      //     });

      //     const currentAbsent = await tx.employee.findMany({
      //       where: {
      //         companyId,
      //       },
      //       select: {
      //         user: {
      //           select: {
      //             attendance: {
      //               where: {
      //                 date: {
      //                   gte: currentStart,
      //                   lte: currentEnd,
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     });
      //     const previousAbsent = await tx.employee.findMany({
      //       where: {
      //         companyId,
      //       },
      //       select: {
      //         user: {
      //           select: {
      //             attendance: {
      //               where: {
      //                 date: {
      //                   gte: previousStart,
      //                   lte: previousEnd,
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     });

      //     return {
      //       current,
      //       previous,
      //       previousAbsent,
      //       currentAbsent,
      //     };
      //   },
      //   {
      //     timeout: 10000, // corrected spelling from "timeOut" to "timeout"
      //   },
      // );

      return { error: 0, body: [] };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(payload: CompanyUpdateDto, id: string) {
    try {
      const { planId, ...rest } = payload;
      delete payload.planId;
      const result = await this.company.update({
        where: { id },
        data: {
          ...(planId && {
            plan: { connect: { id: planId } },
          }),
          ...rest, // strips undefined fields
        },
      });

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getcompany(companyId: string) {
    try {
      const result = await this.company.findFirst({
        where: { id: companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setRotaRule(payload: RotaRuleSettingDto, companyId: string) {
    try {
      const result = await this.rotaRuleSetting.upsert({
        where: { companyId },
        update: {
          ...payload,
        },
        create: {
          ...payload,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getRotaRule(companyId: string) {
    try {
      const result = await this.rotaRuleSetting.findFirst({
        where: { companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setShiftSetting(payload: ShiftSettingDto, companyId: string) {
    try {
      const result = await this.shiftSetting.upsert({
        where: { companyId },
        update: {
          ...payload,
        },
        create: {
          ...payload,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  
  async getShiftSetting(companyId: string) {
    try {
      const result = await this.shiftSetting.findFirst({
        where: { companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setHolidayRequestSetting(payload: HolidayRequestRuleSettingDto, companyId: string) {
    try {
      const result = await this.holidayRequestRuleSetting.upsert({
        where: { companyId },
        update: {
          ...payload,
        },
        create: {
          ...payload,
          company: {
            connect: {
              id: companyId,
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getHolidayRequestSetting(companyId: string) {
    try {
      const result = await this.holidayRequestRuleSetting.findFirst({
        where: { companyId },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async setDigiTimetSetting(payload: DigiTimeSettingDto, companyId: string) {
    try {
      const {apps, ...rest} = payload
      const result = await this.digiTimeSetting.upsert({
        where: { companyId },
        update: {
          ...rest,
          apps:{
            deleteMany:{},
            createMany:{
              data:apps.map(app=>{
                return {...app, companyId}
              })
            }
          }
        },
        create: {
          ...rest,
          company: {
            connect: {
              id: companyId,
            },
          },
          apps:{
            createMany:{
              data:apps.map(app=>{
                return {...app, companyId}
              })
            }
          }
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getDigiTimetSetting(companyId: string) {
    try {
      const result = await this.digiTimeSetting.findFirst({
        where: { companyId },
        include:{apps:true}
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  
  async setBreaks(payload: BreakComplianceSettingDto, companyId: string) {
    try {
      const {breaks, ...rest} = payload
      const result = await this.breakComplianceSetting.upsert({
        where: { companyId },
        update: {
          ...rest,
          breaks:{
            deleteMany:{},
            createMany:{
              data:breaks.map(app=>{
                return {...app, companyId}
              })
            }
          }
        },
        create: {
          ...rest,
          company: {
            connect: {
              id: companyId,
            },
          },
          breaks:{
            createMany:{
              data:breaks.map(app=>{
                return {...app, companyId}
              })
            }
          }
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async getBreaks(companyId: string) {
    try {
      const result = await this.breakComplianceSetting.findFirst({
        where: { companyId },
        include:{breaks:true}
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
