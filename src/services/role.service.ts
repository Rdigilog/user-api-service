import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly responseService: ResponsesService,
    private readonly prismaService: PrismaService, // instantiated via DI
  ) {}

  // Simple list of roles
  async list() {
    try {
      const result = await this.prismaService.role.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      return { error: 0, body: result };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  // Paginated and sortable list of roles
  async all(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const filter: Prisma.RoleWhereInput = {};

      if (search) {
        filter.OR = [
          { name: { contains: search, mode: 'insensitive' } }, // example search
        ];
      }

      const result = await this.prismaService.role.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.prismaService.role.count({
          where: filter,
        });

        const paginatedData = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );

        return { error: 0, body: paginatedData };
      }

      return { error: 1, body: 'No Role(s) found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }
}
