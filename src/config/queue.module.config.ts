// import { FILE } from "dns";
import { FILE } from "dns";
import { MAIL, SMS } from "src/enums/queue.enums";
import { QueueModule } from "src/queue/src";

export const QueueModuleConfig = QueueModule.register({
  queues: [MAIL, SMS, FILE],
  flows: ['MAIL_PROCESSOR'],
});
