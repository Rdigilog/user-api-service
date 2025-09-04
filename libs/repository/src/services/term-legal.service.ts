import { PrismaService } from '@app/config/services/prisma.service';
import { CreateTermLegalDto } from '@app/model/term.legal.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma, TermLegalType } from '@prisma/client';

@Injectable()
export class TermLegalService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
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
        filter.OR = [];
      }

      if (type) {
        filter.type = type;
      }

      const result = await this.termLegal.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.termLegal.count({ where: filter });
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

  async create(payload: CreateTermLegalDto) {
    try {
      const result = await this.termLegal.create({
        data: {
          ...payload,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  async update(payload: CreateTermLegalDto, id: string) {
    try {
      const result = await this.termLegal.update({
        where: { id },
        data: {
          ...payload,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  async view(id: string) {
    try {
      const result = await this.termLegal.findUnique({
        where: { id },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
