// import { FILE } from "dns";
import { FILE } from 'dns';
import { MAIL, SMS } from 'src/enums/queue.enums';
import { QueueModule } from 'src/queue/src';
import { FILE_REMOVAL } from 'src/queue/src/constants/queue.contant';

export const QueueModuleConfig = QueueModule.register({
  queues: [MAIL, SMS, FILE, FILE_REMOVAL],
  flows: ['MAIL_PROCESSOR'],
});
