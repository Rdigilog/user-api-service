import { PrismaService } from '@app/config/services/prisma.service';
import {
  AssignBranchUserDto,
  CreateBranchDto,
} from '@app/model/branch/branch.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Body, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
  async list(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.BranchWhereInput = { companyId };
      if (search) {
        filter.OR = [];
      }

      const result = await this.branch.findMany({
        where: filter,
        include: {
          company: true,
          country: true,
          manager: true,
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.branch.count({ where: filter });
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

  async create(payload: CreateBranchDto, companyId: string) {
    try {
      const result = await this.branch.create({
        data: {
          name: payload.name,
          description: payload.description,
          country: {
            connect: {
              code: payload.countryCode,
            },
          },
          timezone: payload.timezone,
          company: {
            connect: {
              id: companyId,
            },
          },
          manager: {
            connect: {
              userId: payload.managerId,
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(payload: Partial<CreateBranchDto>, branchId: string) {
    try {
      const result = await this.branch.update({
        where: {
          id: branchId,
        },
        data: {
          ...payload,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async assingToBranch(payload: AssignBranchUserDto, branchId: string) {
    try {
      const result = await this.profileBranch.createMany({
        data: payload.userIds.map((userId) => {
          return { userId, branchId: branchId };
        }),
      });
      if (result.count) {
        const branch = await this.branch.findUnique({
          where: { id: branchId },
          include: {
            profileBranch: {
              select: {
                profile: true,
              },
            },
          },
        });
        return { error: 0, body: branch };
      }
      return { error: 1, body: "failed to assign user('s) to branch" };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async removeFromBranch(payload: AssignBranchUserDto, branchId: string) {
    try {
      const result = await this.profileBranch.deleteMany({
        where: { userId: { in: payload.userIds }, branchId: branchId },
      });
      if (result.count) {
        const branch = await this.branch.findUnique({
          where: { id: branchId },
          include: {
            profileBranch: {
              select: {
                profile: true,
              },
            },
          },
        });
        return { error: 0, body: branch };
      }
      return { error: 1, body: "failed to unassign user('s) from branch" };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
