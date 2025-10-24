import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { UpdateSubscriptionUsersDto } from 'src/models/plans/plan.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class SubscriptionService extends PrismaService {
  constructor(
    private readonly userConfigService: ConfigService,
    private readonly responseService: ResponsesService,
  ) {
    super(userConfigService);
  }

  async companySubscription(companyId: string) {
    try {
      const result = await this.subscription.findFirst({
        where: { companyId },
        include: {
          plan: true,
        },
      });

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async companyBillingHistory(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.BillingHistoryWhereInput = { companyId };
      if (search) {
        filter.OR = [];
      }

      const result = await this.billingHistory.findMany({
        where: filter,
        include: {
          plan: true,
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.billingHistory.count({ where: filter });
      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );
      return { error: 0, body: paginatedProduct };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }

  async addUsers(companyId: string, payload: UpdateSubscriptionUsersDto) {
    try {
      const result = await this.subscription.update({
        where: { companyId },
        data: payload,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
