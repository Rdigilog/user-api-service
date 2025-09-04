import { PrismaService } from '@app/config/services/prisma.service';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService extends PrismaService {
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
      const filter: Prisma.EmployeeWhereInput = { companyId };
      if (search) {
        filter.OR = [];
      }

      const result = await this.employee.findMany({
        where: filter,
        select: {
          phoneNumber: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          jobInformation: {
            select: {
              jobRole: {
                select: {
                  name: true,
                  color: true,
                },
              },
              currencyCode: true,
              payRatePerHour: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.employee.count({ where: filter });
        const paginatedProduct = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedProduct };
      }
      return { error: 1, body: 'No Record found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }
}
