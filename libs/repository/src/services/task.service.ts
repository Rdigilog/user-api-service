import { PrismaService } from '@app/config/services/prisma.service';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService extends PrismaService {
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
      const filter: Prisma.TaskWhereInput = {};
      if (search) {
        filter.OR = [];
      }

      // if (status) {
      //   filter.status = status;
      // }

      const result = await this.task.findMany({
        where: filter,
        include: {
          company: true,
          assignedTo: true,
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.task.count({ where: filter });
        const paginatedProduct = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedProduct };
      }
      return { error: 1, body: 'No Order found' };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }
}
