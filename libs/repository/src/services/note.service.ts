import { PrismaService } from '@app/config/services/prisma.service';
import { CreateNoteDto } from '@app/model/note.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoteService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
  async create(payload: CreateNoteDto, userId: string) {
    try {
      const result = await this.note.create({
        data: {
          ...payload,
          userId,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  async update(payload: CreateNoteDto, noteId: string) {
    try {
      const result = await this.note.update({
        where: { id: noteId },
        data: {
          ...payload,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
  async list(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    userId?: string,
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.NoteWhereInput = {};
      if (search) {
        filter.OR = [];
      }

      if (userId) {
        filter.userId = userId;
      }

      const result = await this.note.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.note.count({ where: filter });
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
      return this.responseService.errorHandler(e);
    }
  }
}
