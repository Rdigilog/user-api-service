import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ResponsesService } from 'src/utils/services/responses.service';

@Injectable()
export class JobRoleService {
  private prisma: PrismaClient;

  constructor(private readonly responseService: ResponsesService) {
    this.prisma = new PrismaClient();
  }

  async all(companyId: string) {
    try {
      const filter: Prisma.JobRoleWhereInput = { companyId };
      const result = await this.prisma.jobRole.findMany({
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
  //     const result = await this.prisma.jobRole.create({
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
  //     const result = await this.prisma.jobRole.update({
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
