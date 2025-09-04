import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private from: string = process.env.MAIL_FROM;
  constructor(private readonly mailerService: MailerService) {}
  sendMail(to: string, subject: string, template: string, content: any) {
    try {
      this.mailerService
        .sendMail({
          to: to,
          from: this.from,
          subject: subject,
          template: template, // The `.pug` or `.hbs` extension is appended automatically.
          context: content,
        })
        .then((success) => {
          console.log(success);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {}
  }
}
