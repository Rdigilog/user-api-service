import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import { process } from 'uniqid';
import crypto from 'crypto'

@Injectable()
export class UtilsService {
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

  nextBilling() {
    const currentDate = new Date();
    const nextBilling = new Date(currentDate);
    nextBilling.setDate(currentDate.getDate() + 30);
    return nextBilling;
  }

  //to help exclude any database field from being send back via apis i.e password and activation tokens
  exclude(data: any, keys: any[]) {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !keys.includes(key)),
    );
  }

  async hashPassword(plain: string, p0: number) {
    try {
      const salt = await genSalt(p0);
      const hashedPassword = await hash(plain, salt);
      return hashedPassword;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async comparePassword(plain, hash) {
    try {
      return await compare(plain, hash);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  validateContact(identifier: string): 'email' | 'phone' | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{7,15}$/; // Supports international and local numbers

    if (emailRegex.test(identifier)) {
      return 'email';
    } else if (phoneRegex.test(identifier)) {
      return 'phone';
    } else {
      return null;
    }
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Check if the phone number starts with "0" and replace it with "234"
    if (phoneNumber.startsWith('0')) {
      return '234' + phoneNumber.slice(1); // Replace first character "0" with "234"
    }
    return phoneNumber; // Return the phone number unchanged if it doesn't start with "0"
  }
  lisaUnique() {
    try {
      return process('RD').toUpperCase();
    } catch (e) {
      return null;
    }
  }

  randomString(length = 8) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = crypto.randomBytes(length);
    let out = '';
    for (let i = 0; i < length; i++) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  }
}
