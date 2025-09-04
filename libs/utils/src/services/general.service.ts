import { Injectable } from '@nestjs/common';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
} from 'date-fns';

type RangeType = 'day' | 'week' | 'month' | 'year';
@Injectable()
export class GeneralService {
  getDateRange(rangeType: RangeType) {
    const now = new Date();

    let currentStartDate: Date;
    let currentEndDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (rangeType) {
      case 'day':
        currentStartDate = startOfDay(now);
        currentEndDate = endOfDay(now);
        previousStartDate = startOfDay(subDays(now, 1));
        previousEndDate = endOfDay(subDays(now, 1));
        break;

      case 'week':
        currentStartDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        currentEndDate = endOfWeek(now, { weekStartsOn: 1 });
        previousStartDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        previousEndDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        break;

      case 'month':
        currentStartDate = startOfMonth(now);
        currentEndDate = endOfMonth(now);
        previousStartDate = startOfMonth(subMonths(now, 1));
        previousEndDate = endOfMonth(subMonths(now, 1));
        break;

      case 'year':
        currentStartDate = startOfYear(now);
        currentEndDate = endOfYear(now);
        previousStartDate = startOfYear(subYears(now, 1));
        previousEndDate = endOfYear(subYears(now, 1));
        break;

      default:
        throw new Error(`Invalid range type: ${rangeType}`);
    }

    return {
      currentEndDate,
      currentStartDate,
      previousEndDate,
      previousStartDate,
    };
  }
}
