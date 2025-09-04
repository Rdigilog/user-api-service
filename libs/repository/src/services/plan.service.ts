import { PrismaService } from '@app/config/services/prisma.service';
import { PlanDto } from '@app/model/plans/plan.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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

  async create(payload: PlanDto) {
    try {
      const plan = await this.plan.create({
        data: {
          name: payload.name,
          active: payload.active,
          description: payload.description,
        },
      });
      return { error: 0, body: plan };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(payload: PlanDto, planId: string) {
    try {
      const plan = await this.plan.update({
        where: { id: planId },
        data: {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.active !== undefined && { active: payload.active }),
          ...(payload.description !== undefined && {
            description: payload.description,
          }),
        },
      });
      return { error: 0, body: plan };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
