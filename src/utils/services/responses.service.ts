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
      message: this.cast(message),
      data: null,
    };
  }
  badRequest(message: any) {
    return {
      statusCode: this.responseCodes['INVALID_REQUEST'],
      message: this.cast(message),
      data: null,
    };
  }
  notFound(message: any) {
    return {
      statusCode: this.responseCodes['INVALID_REQUEST'],
      message: this.cast(message),
      data: null,
    };
  }
  exception(message: any) {
    return {
      statusCode: this.responseCodes['EXCEPTION'],
      message: this.cast(message),
      data: null,
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
    const extractMessage = (msg: string) => {
      // Normalize whitespace and remove the giant Prisma invocation block
      msg = msg
        .replace(/\s+/g, ' ')
        .replace(/Invalid\s+`prisma\.[\s\S]*?invocation:\s*/gi, '')
        .trim();

      // Handle common Prisma patterns
      const patterns = [
        /Unknown argument `([^`]+)`.*?(?=\s|$)/i,
        /Invalid value for argument `([^`]+)`.*?(?=\s|$)/i,
        /Argument `([^`]+)` is missing/i,
        /Field `([^`]+)` is required/i,
        /Record (?:to update|to delete|not found).*?(?=\s|$)/i,
        /Unique constraint failed on the fields: (.+?)(?=\s|$)/i,
        /Foreign key constraint failed on the field: (.+?)(?=\s|$)/i,
        /Did you mean `([^`]+)`\?/i,
      ];

      for (const p of patterns) {
        const m = msg.match(p);
        if (m) {
          // Craft more human-friendly phrasing
          if (p.source.includes('Unknown argument'))
            return `Unknown field "${m[1]}" in your Prisma query.`;
          if (p.source.includes('Invalid value for argument'))
            return `Invalid value for field "${m[1]}".`;
          if (p.source.includes('is missing'))
            return `Missing required field "${m[1]}".`;
          if (p.source.includes('Field'))
            return `Field "${m[1]}" is required.`;
          if (p.source.includes('Unique constraint'))
            return `Duplicate value detected on fields: ${m[1]}.`;
          if (p.source.includes('Foreign key constraint'))
            return `Foreign key constraint failed on field: ${m[1]}.`;
          if (p.source.includes('Did you mean'))
            return `Unknown field used. Did you mean "${m[1]}"?`;
          if (p.source.includes('Record'))
            return `Record not found or relation missing.`;
        }
      }

      // Prisma known error code fallback
      const knownCodeMatch = msg.match(/Error code:\s*(P\d{4})/);
      if (knownCodeMatch) return `Prisma error ${knownCodeMatch[1]}`;

      // Handle generic JS error messages
      const genericMatch = msg.match(/Error:\s*(.+)/);
      if (genericMatch) return genericMatch[1];

      return msg;
    };

    // Prisma-related errors
    if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientInitializationError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      return {
        error: 2,
        body: extractMessage(e.message),
      };
    }

    // JS errors
    if (e instanceof Error) {
      return {
        error: 2,
        body: extractMessage(e.message),
      };
    }

    // Fallback
    return {
      error: 2,
      body: extractMessage(String(e)),
    };
  }
  // errorHandler(e: any) {
  //   if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //     const messages: Record<string, string> = {
  //       P2000: 'Input value too long for column.',
  //       P2001: 'Record not found.',
  //       P2002: 'Duplicate value violates unique constraint.',
  //       P2003: 'Foreign key constraint failed.',
  //       P2004: 'Database constraint failed.',
  //       P2005: 'Invalid value stored for this field.',
  //       P2006: 'Provided value is invalid.',
  //       P2007: 'Data validation failed.',
  //       P2008: 'Query parsing error.',
  //       P2009: 'Query validation failed.',
  //       P2010: 'Raw query execution failed.',
  //       P2011: 'Null constraint violation.',
  //       P2012: 'Missing required value.',
  //       P2013: 'Missing required argument.',
  //       P2014: 'Invalid relation between records.',
  //       P2015: 'Related record not found.',
  //       P2016: 'Query interpretation error.',
  //       P2017: 'Relation records not connected.',
  //       P2018: 'Required connected records not found.',
  //       P2019: 'Input error.',
  //       P2020: 'Value out of range.',
  //       P2021: 'Table does not exist.',
  //       P2022: 'Column does not exist.',
  //       P2023: 'Inconsistent column data.',
  //       P2024: 'Database operation timeout.',
  //       P2025: 'Record not found.',
  //       P2026: 'Unsupported feature.',
  //       P2027: 'Multiple errors occurred.',
  //       P2028: 'Transaction API error.',
  //       P2029: 'Invalid request to query engine.',
  //     };

  //     const message =
  //       messages[e.code] || e.message.split('\n').slice(-1)[0].trim();
  //     return { error: 2, body: message };
  //   }

  //   if (e instanceof Prisma.PrismaClientValidationError) {
  //     return {
  //       error: 2,
  //       body: 'Validation error: please check your query inputs.',
  //     };
  //   }

  //   if (e instanceof Prisma.PrismaClientInitializationError) {
  //     return { error: 2, body: 'Failed to initialize Prisma client.' };
  //   }

  //   if (e instanceof Prisma.PrismaClientRustPanicError) {
  //     return { error: 2, body: 'Internal Prisma engine error (Rust panic).' };
  //   }

  //   if (e instanceof Prisma.PrismaClientUnknownRequestError) {
  //     return { error: 2, body: 'Unknown Prisma error occurred.' };
  //   }

  //   if (e instanceof Error) {
  //     return { error: 2, body: e.message };
  //   }

  //   return { error: 2, body: String(e) };
  // }
}

interface DecimalFormat {
  s: number; // Sign
  e: number; // Exponent
  d: number[]; // Digits (array of numbers)
}
