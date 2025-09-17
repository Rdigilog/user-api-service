import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';

export const MailConfig = MailerModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>(CONFIG_KEYS.MAIL_HOST),
      port: configService.get<number>(CONFIG_KEYS.MAIL_PORT),
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: configService.get<string>(CONFIG_KEYS.MAIL_USER),
        pass: configService.get<string>(CONFIG_KEYS.MAIL_PASS),
      },
    },
    defaults: {
      from: '"DigiLog" <inof@digiLog.com>',
    },
    template: {
      dir: process.cwd() + '/mails/',
      adapter: new HandlebarsAdapter(), // or new PugAdapter()
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
});
