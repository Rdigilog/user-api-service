// inject-queue.decorator.ts
import { InjectQueue } from '@nestjs/bullmq';
import { MAIL, SMS, FILE, APPLICATION } from '../constants/queue.contant';
// import { MAIL, SMS } from '../../../mail/src/constants/mail.constant';

export const InjectMailQueue = () => InjectQueue(MAIL);
export const InjectSMSQueue = () => InjectQueue(SMS);
export const InjectFileQueue = () => InjectQueue(FILE);
