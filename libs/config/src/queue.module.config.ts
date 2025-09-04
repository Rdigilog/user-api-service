import { MAIL, SMS } from '@app/mail/constants/mail.constant';
import { QueueModule } from '@app/queue';
import { FILE } from '@app/queue/constants/queue.contant';

export const QueueModuleConfig = QueueModule.register({
  queues: [MAIL, SMS, FILE],
  flows: ['MAIL_PROCESSOR'],
});
