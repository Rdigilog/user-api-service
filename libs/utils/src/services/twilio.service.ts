import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  constructor(private readonly configService: ConfigService) {}

  async sendSMS(phoneNumber, message) {
    try {
      // Initialize the Twilio client
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_TOKEN,
      );
      const data = {
        body: message,
        to: this.formatPhoneNumber(phoneNumber),
        from: process.env.TWILIO_FROM,
      };
      await client.messages
        .create(data)
        .then((message) => console.log(message));
      console.log('SMS sent successfully.');
    } catch (error) {
      console.error('Error sending SMS:', error.message);
    }
  }

  formatPhoneNumber(phoneNumber: string): string {
    phoneNumber = phoneNumber.trim();
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  }
}
