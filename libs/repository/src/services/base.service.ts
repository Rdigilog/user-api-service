import { PrismaService } from '@app/config/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class BaseService extends PrismaService {
  async countries() {
    try {
      const result = await this.country.findMany();
      return { error: 0, body: result };
      // return { error: 1, body: null };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }
  async getCountriesPaginated(
    take: number,
    skip: number,
    sortDirection: 'asc' | 'desc' = 'desc',
    sortBy: string = 'id',
    search?: any,
  ) {
    try {
      const filter: Prisma.CountryWhereInput = {};
      if (search) {
        filter.name = { contains: search, mode: 'insensitive' };
      }
      const result = await this.country.findMany({
        take,
        skip,
        where: filter,
        orderBy: { [sortBy]: sortDirection },
      });
      const totalItems = await this.country.count({
        where: filter,
      });
      return { error: 0, body: { result, totalItems } };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }

  async getByCountry(
    code: string,
    take: number,
    skip: number,
    sortDirection: 'asc' | 'desc' = 'desc',
    sortBy: string = 'id',
    search?: any,
  ) {
    try {
      const filter: Prisma.StateWhereInput = { countryCode: code };
      if (search) {
        filter.name = { contains: search, mode: 'insensitive' };
      }
      const result = await this.state.findMany({
        where: filter,
        take,
        skip,
        orderBy: { [sortBy]: sortDirection },
      });
      if (result.length) {
        const totalItems = await this.state.count({
          where: filter,
        });
        return { error: 0, body: { result, totalItems } };
      } else return { error: 0, body: [] };
    } catch (e: any) {
      return { error: 2, body: e.message };
    }
  }
  async getStatesByName(name: string) {
    try {
      const result = await this.state.findMany({
        where: { name },
      });
      if (result.length <= 0) return { error: 1, body: 'No records found' };
      return { error: 0, body: result };
    } catch (e: any) {
      return { error: 2, body: e.message };
    }
  }
}
