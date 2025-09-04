import { PrismaService } from '@app/config/services/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { Roles } from 'libs/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async hasRole(role: string, user: User, companyId: string): Promise<boolean> {
    let roles = 0;
    if (role == 'SUPER_ADMIN') {
      roles = await this.prismaService.userRole.count({
        where: {
          userId: user.id,
          role: {
            name: role,
          },
        },
      });
    } else {
      roles = await this.prismaService.userRole.count({
        where: {
          userId: user.id,
          companyId,
          role: {
            name: role,
          },
        },
      });
    }
    return roles <= 0;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get(Roles, context.getHandler());
    if (!role) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const companyId = request.headers['X-Company-Id'];
    const user = request.user;
    return await this.hasRole(role, user, companyId);
  }
}
