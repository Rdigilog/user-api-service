// inject-queue.decorator.ts
import { InjectQueue } from '@nestjs/bullmq';
import { FILE, MAIL, SMS } from 'src/enums/queue.enums';
// import { MAIL, SMS } from '../../../mail/src/constants/mail.constant';

export const InjectMailQueue = () => InjectQueue(MAIL);
export const InjectSMSQueue = () => InjectQueue(SMS);
export const InjectFileQueue = () => InjectQueue(FILE);
