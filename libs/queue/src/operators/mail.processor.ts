import { WorkerHostProcessor } from '@app/queue/processor/worker-host.processor';
import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendMailDto } from '@app/mail/dtos/mail.dto';
import { MailService } from '@app/mail';

@Processor('MAIL')
@Injectable()
export class MailProcessor extends WorkerHostProcessor {
  constructor(private readonly mailService: MailService) {
    super();
  }
  process(job: Job<SendMailDto, any, string>): Promise<any> {
    console.log("running mail sending")
    return Promise.resolve(
      this.mailService.sendMail(
        job.data.to,
        job.data.subject,
        job.data.template,
        job.data.content,
      ),
    );
  }
}
