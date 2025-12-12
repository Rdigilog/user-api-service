import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class PlanService {
  private prisma: PrismaClient;

  constructor(private readonly responseService: ResponsesService) {
    this.prisma = new PrismaClient();
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

      const result = await this.prisma.plan.findMany({
        where: filter,
        include: {
          features: true,
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prisma.plan.count({ where: filter });
      const paginatedPlan = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );

      return { error: 0, body: paginatedPlan };
    } catch (e: any) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async list() {
    try {
      const plans = await this.prisma.plan.findMany({
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
