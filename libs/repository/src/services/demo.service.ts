import { PrismaService } from '@app/config/services/prisma.service';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateDEMODto } from 'libs/model/demo.dto';

@Injectable()
export class DemoService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
  async list(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.DemoWhereInput = {};
      if (search) {
        filter.OR = [];
      }

      const result = await this.demo.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.demo.count({ where: filter });
        const paginatedProduct = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedProduct };
      }
      return { error: 1, body: [] };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }

  async create(payload: CreateDEMODto) {
    try {
      const result = await this.demo.create({
        data: {
          ...payload,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
