import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { PlanDto } from 'src/models/plans/plan.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class PlanService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
  async all(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.PlanWhereInput = {};
      if (search) {
        filter.OR = [];
      }

      const result = await this.plan.findMany({
        where: filter,
        include: {
          planFeature: {
            select: {
              maxLimit:true,
              hasLimit:true,
              feature: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.plan.count({ where: filter });
        const paginatedPlan = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedPlan };
      }
      return { error: 1, body: 'No Order found' };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }

  async list() {
    try {
      const plans = await this.plan.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
        },
      });
      return { error: 0, body: plans };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
