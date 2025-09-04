import { PrismaService } from '@app/config/services/prisma.service';
import { AssignPermissionsDto, CreateItemDto } from '@app/model/role.dto';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService extends PrismaService {
  constructor(private readonly responseService: ResponsesService) {
    super();
  }
  async list() {
    try {
      const result = await this.role.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      return { error: 0, body: result };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }
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
        filter.OR = [];
      }

      const result = await this.role.findMany({
        where: filter,
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.role.count({ where: filter });
        const paginatedProduct = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedProduct };
      }
      return { error: 1, body: 'No Employee(s) found' };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }

  async create(payload: CreateItemDto) {
    try {
      const result = await this.role.create({
        data: {
          name: payload.name,
          description: payload.description,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async update(payload: Partial<CreateItemDto>, id: string) {
    try {
      const data: any = {
        ...(payload.name && { name: payload.name }),
        ...(payload.description && { description: payload.description }),
      };

      const result = await this.role.update({
        where: { id },
        data,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async createPermission(payload: CreateItemDto) {
    try {
      const result = await this.permission.create({
        data: payload,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async assignRolePermissions(payload: AssignPermissionsDto) {
    try {
      await this.rolePermission.deleteMany({
        where: {
          roleId: payload.roleId,
        },
      });
      const result = await this.rolePermission.createMany({
        data: payload.permissions.map((permission) => ({
          roleId: payload.roleId,
          permissionId: permission,
        })),
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async rolePermissions(roleId: string) {
    try {
      const result = await this.permission.findMany({
        where: {
          permissionRolePermission: {
            some: { roleId },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async permissions() {
    try {
      const result = await this.permission.findMany();
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
