import { WorkerHostProcessor } from '@app/queue/processor/worker-host.processor';
import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { TwilioService } from '@app/mail/services/twilio.service';
import { SMSDto } from '@app/mail/dtos/sms.dto';

@Processor('SMS')
@Injectable()
export class SMSProcessor extends WorkerHostProcessor {
  constructor(private readonly twilioService: TwilioService) {
    super();
  }
  process(job: Job<SMSDto, any, string>): Promise<any> {
    return Promise.resolve(
      this.twilioService.sendSMS(job.data.to, job.data.content),
    );
  }
}
