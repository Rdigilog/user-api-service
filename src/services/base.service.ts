/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class BaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async countries() {
    try {
      const result = await this.prisma.country.findMany();
      return { error: 0, body: result };
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

      const result = await this.prisma.country.findMany({
        take,
        skip,
        where: filter,
        orderBy: { [sortBy]: sortDirection },
      });

      const totalItems = await this.prisma.country.count({
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

      const result = await this.prisma.state.findMany({
        where: filter,
        take,
        skip,
        orderBy: { [sortBy]: sortDirection },
      });

      if (result.length) {
        const totalItems = await this.prisma.state.count({
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
      const result = await this.prisma.state.findMany({
        where: { name },
      });

      if (result.length <= 0) return { error: 1, body: 'No records found' };

      return { error: 0, body: result };
    } catch (e: any) {
      return { error: 2, body: e.message };
    }
  }
}
