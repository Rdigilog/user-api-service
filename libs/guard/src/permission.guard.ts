import { PrismaService } from '@app/config/services/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { Permission } from 'libs/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async hasPermission(
    permission: string,
    user: User,
    companyId: string,
  ): Promise<boolean> {
    if (user.type == 'SUPER_ADMIN') return true;
    const permissions = await this.prismaService.userRole.count({
      where: {
        userId: user.id,
        companyId,
        role: {
          rolePermission: {
            some: { permission: { name: permission } },
          },
        },
      },
    });
    return permissions <= 0;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get(Permission, context.getHandler());
    if (!permission) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const companyId = request.headers['X-Company-Id'];
    const user = request.user;
    return await this.hasPermission(permission, user, companyId);
  }
}
