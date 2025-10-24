import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
import { CreateJobRoleDto } from 'src/models/company/job-role.dto';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class JobRoleService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }

  // async list(
  //   companyId: string,
  //   page: number,
  //   size: number,
  //   search: string = '',
  //   sortBy: string = 'updatedAt',
  //   sortDirection: 'asc' | 'desc' = 'desc',
  // ) {
  //   try {
  //     const { offset, limit } = this.responseService.pagination(page, size);
  //     const filter: Prisma.jobRoleWhereInput = { companyId };
  //     if (search) {
  //       filter.OR = [];
  //     }

  //     const result = await this.jobRole.findMany({
  //       where: filter,
  //       include: {
  //         company: true,
  //       },
  //       orderBy: {
  //         [sortBy]: sortDirection,
  //       },
  //       skip: offset,
  //       take: limit,
  //     });

  //     if (result.length) {
  //       const totalItems = await this.jobRole.count({ where: filter });
  //       const paginatedProduct = this.responseService.pagingData(
  //         { result, totalItems },
  //         page,
  //         limit,
  //       );
  //       return { error: 0, body: paginatedProduct };
  //     }
  //     return { error: 1, body: 'No Record found' };
  //   } catch (e) {
  //     console.error(e);
  //     return this.responseService.errorHandler(e);
  //   }
  // }
  async all(companyId: string) {
    try {
      const filter: Prisma.JobRoleWhereInput = { companyId };
      const result = await this.jobRole.findMany({
        where: filter,
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

  // async create(payload: CreateJobRoleDto, companyId: string) {
  //   try {
  //     const result = await this.jobRole.create({
  //       data: {
  //         ...payload,
  //         company: {
  //           connect: {
  //             id: companyId,
  //           },
  //         },
  //       },
  //     });
  //     return { error: 0, body: result };
  //   } catch (e) {
  //     return this.responseService.errorHandler(e);
  //   }
  // }

  // async update(payload: Partial<CreateJobRoleDto>, id: string) {
  //   try {
  //     const result = await this.jobRole.update({
  //       where: {
  //         id,
  //       },
  //       data: {
  //         ...payload,
  //       },
  //     });
  //     return { error: 0, body: result };
  //   } catch (e) {
  //     return this.responseService.errorHandler(e);
  //   }
  // }
}
