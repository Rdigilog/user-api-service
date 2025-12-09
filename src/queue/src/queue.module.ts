import { DynamicModule, Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './queue-board.module-definition';

// import { FileUploadService } from '@app/utils/services/file-upload.service';
@Global()
@Module({
  providers: [QueueService],
  exports: [QueueService],
  imports: [],
})
export class QueueModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const bullModules = options.queues.map((name) =>
      BullModule.registerQueue({
        name,
        prefix: '{bull:queue}', // Add prefix to avoid Error: "ReplyError: CROSSSLOT Keys in request don't hash to the same slot..."
      }),
    );

    const flowProducers = (options.flows || []).map((flow) =>
      BullModule.registerFlowProducer({
        name: flow,
      }),
    );

    return {
      ...super.register(options),
      imports: [...bullModules, ...flowProducers],
      exports: [...bullModules, ...flowProducers],
    };
  }
}
