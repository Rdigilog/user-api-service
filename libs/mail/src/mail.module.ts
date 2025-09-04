import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { QueueModule } from '@app/queue';
import { MAIL, SMS } from './constants/mail.constant';
// import { MailProcessor } from './operators/mail.processor';
import { TwilioService } from './services/twilio.service';
import { ConfigService } from '@nestjs/config';
// import { SMSProcessor } from './operators/sms.processor.ts';

@Module({
  imports: [],
  providers: [MailService, TwilioService, ConfigService],
  exports: [MailService, TwilioService],
})
export class MailModule {}
