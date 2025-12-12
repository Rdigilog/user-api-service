import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { UpdateSubscriptionUsersDto } from 'src/models/plans/plan.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService, // ← Injected
    private readonly responseService: ResponsesService,
  ) {}

  async companySubscription(companyId: string) {
    try {
      const result = await this.prisma.subscription.findFirst({
        // ← updated
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
        filter.OR = [
          // add search fields here if needed
          // { reference: { contains: search, mode: 'insensitive' } },
        ];
      }

      const result = await this.prisma.billingHistory.findMany({
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

      const totalItems = await this.prisma.billingHistory.count({
        where: filter,
      });

      const paginatedData = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );

      return { error: 0, body: paginatedData };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async addUsers(companyId: string, payload: UpdateSubscriptionUsersDto) {
    try {
      const result = await this.prisma.subscription.update({
        where: { companyId },
        data: payload,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async cancelSubscription(companyId: string) {
    try {
      await this.prisma.subscription.update({
        where: { companyId },
        data: { status: 'CANCELLED' },
      });

      return { error: 0, body: 'Subscription cancelled successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
