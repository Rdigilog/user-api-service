import { Injectable } from '@nestjs/common';
import { Prisma, TermLegalType } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class TermLegalService {
  constructor(
    private readonly prisma: PrismaService, // Inject Prisma
    private readonly responseService: ResponsesService,
  ) {}

  async list(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    type?: TermLegalType,
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);

      const filter: Prisma.TermLegalWhereInput = {};

      if (search) {
        filter.OR = [
          // Optional search fields:
          // { title: { contains: search, mode: 'insensitive' } },
          // { content: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (type) {
        filter.type = type;
      }

      const result = await this.prisma.termLegal.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.prisma.termLegal.count({ where: filter });
        const paginatedData = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedData };
      }

      return { error: 1, body: [] };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async view(id: string) {
    try {
      const result = await this.prisma.termLegal.findUnique({
        where: { id },
      });

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
