import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResponsesService {
  responseCodes = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INVALID_REQUEST: 400,
    FORBIDDEN: 403,
    TIMEOUT: 403,
    EXCEPTION: 500,
  };
  responseMessages = {
    SUCCESS: 'SUCCESSFUL',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'Not Found',
    INVALID_REQUEST: 'INVALID REQUEST',
    FORBIDDEN: 'FORBIDDEN',
    TIMEOUT: 'GATEWAY TIMEOUT',
    EXCEPTION: 'INTERNAL SERVER ERROR',
  };

  success(message: any) {
    return {
      statusCode: this.responseCodes['SUCCESS'],
      message: this.responseMessages['SUCCESS'],
      data: this.cast(message),
    };
  }
  unauthorized(message: any) {
    return {
      statusCode: this.responseCodes['UNAUTHORIZED'],
      message: this.responseMessages['UNAUTHORIZED'],
      data: this.cast(message),
    };
  }
  badRequest(message: any) {
    return {
      statusCode: this.responseCodes['INVALID_REQUEST'],
      message: this.responseMessages['INVALID_REQUEST'],
      data: this.cast(message),
    };
  }
  notFound(message: any) {
    return {
      statusCode: this.responseCodes['INVALID_REQUEST'],
      message: this.responseMessages['INVALID_REQUEST'],
      data: this.cast(message),
    };
  }
  exception(message: any) {
    return {
      statusCode: this.responseCodes['EXCEPTION'],
      message: this.responseMessages['EXCEPTION'],
      data: this.cast(message),
    };
  }

  cast(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (this.isDecimal(obj)) {
      console.log(obj);
      return obj.toString();
    }

    if (typeof obj === 'bigint') {
      return obj.toString();
    }

    if (obj instanceof Date) {
      return obj.toISOString(); // Convert Date to ISO string
    }

    if (Array.isArray(obj)) {
      return obj.map((value) => this.cast(value));
    }

    if (typeof obj === 'object') {
      const newObj: { [key: string]: any } = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = this.cast(obj[key]);
      }
      return newObj;
    }

    return obj;
  }

  isDecimal(object: any): object is DecimalFormat {
    return (
      typeof object === 'object' &&
      object !== null &&
      's' in object &&
      typeof object.s === 'number' &&
      'e' in object &&
      typeof object.e === 'number' &&
      'd' in object &&
      Array.isArray(object.d) &&
      object.d.every((digit) => typeof digit === 'number')
    );
  }

  pagination(page: number, size: number) {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
  }
  pagingData(data: any, page: any, limit: any) {
    const { totalItems, result } = data;
    const currentPage = page ? +page : 1;
    const totalPages = totalItems > limit ? Math.ceil(totalItems / limit) : 1;
    return { totalItems, result, totalPages, currentPage };
  }

  errorHandler(e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: 2, body: e.message.split('\n').slice(-1)[0].trim() }; // Extracts only the meaningful error message
    }
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      return { error: 2, body: e.message.split('\n').slice(-1)[0].trim() }; // Extracts only the meaningful error message
    }
    if (e instanceof Prisma.PrismaClientRustPanicError) {
      return { error: 2, body: e.message.split('\n').slice(-1)[0].trim() }; // Extracts only the meaningful error message
    }
    if (e instanceof Prisma.PrismaClientInitializationError) {
      return { error: 2, body: e.message.split('\n').slice(-1)[0].trim() }; // Extracts only the meaningful error message
    }
    if (e instanceof Error) {
      return { error: 2, body: e.message };
    }
    return { error: 2, body: e.message.split('\n').slice(-1)[0].trim() };
  }
}

interface DecimalFormat {
  s: number; // Sign
  e: number; // Exponent
  d: number[]; // Digits (array of numbers)
}
