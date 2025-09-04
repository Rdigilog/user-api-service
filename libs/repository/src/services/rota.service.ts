import { PrismaService } from '@app/config/services/prisma.service';
import { CreateRotaDto } from '@app/model/rota.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class RotaService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
  async list(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    userId?: string,
    companyId?: string,
    branchId?: string,
  ) {
    try {
      // const { offset, limit } = this.responseService.pagination(page, size);
      // const filter: Prisma.RotaWhereInput = {};
      // if (search) {
      //   filter.OR = [];
      // }
      // if (companyId) {
      //   filter.user = { company: { some: { id: companyId } } };
      // }

      // if (branchId) {
      //   filter.user = {
      //     company: { some: { branch: { some: { id: branchId } } } },
      //   };
      // }

      // if (userId) {
      //   filter.userId = userId;
      // }

      // const result = await this.rota.findMany({
      //   where: filter,
      //   orderBy: {
      //     [sortBy]: sortDirection,
      //   },
      //   skip: offset,
      //   take: limit,
      // });

      // if (result.length) {
      //   const totalItems = await this.rota.count({ where: filter });
      //   const paginatedProduct = this.responseService.pagingData(
      //     { result, totalItems },
      //     page,
      //     limit,
      //   );
      //   return { error: 0, body: paginatedProduct };
      // }
      return { error: 1, body: 'No rota found' };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }

  async create(payload: CreateRotaDto) {
    try {
      // const { userId, ...rest } = payload;
      // const result = await this.rota.create({
      //   data: {
      //     ...rest,
      //     user: {
      //       connect: {
      //         id: userId,
      //       },
      //     },
      //   },
      // });
      return { error: 0, body: '' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  async update(payload: Partial<CreateRotaDto>, id: string) {
    try {
      const data: any = {
        ...(payload.date && { date: payload.date }),
        ...(payload.endTime && { endTime: payload.endTime }),
        ...(payload.startTime && { startTime: payload.startTime }),
        ...(payload.notes && { notes: payload.notes }),
        ...(payload.shiftType && { shiftType: payload.shiftType }),
        ...(payload.userId && {
          user: {
            connect: {
              id: payload.userId,
            },
          },
        }),
      };

      const result = await this.rota.update({
        where: { id },
        data,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
