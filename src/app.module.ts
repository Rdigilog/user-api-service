import { Module } from '@nestjs/common';
import { UtilsModule } from './utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisCacheOptions } from './config/redis.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtConfig } from './config/jwt.config';
import { MailConfig } from './config/mail.config';
import { QueueConfig } from './config/queue.config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { PlanController } from './controllers/plan.controller';
import { StatusInterceptor } from './interceptors/status.interceptor';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { TermLegalService } from './services/term-legal.service';
import { PrismaService } from './config/prisma.service';
import { PlanService } from './services/plan.service';
import { bullboardConfig } from './config/bull-board.config';
import { QueueModuleConfig } from './config/queue.module.config';
import { BaseController } from './controllers/base.controller';
import { BaseService } from './services/base.service';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { JobRoleController } from './controllers/job-role.controller';
import { JobRoleService } from './services/job-role.service';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   // rootPath: join(__dirname, '..', 'uploads'),
    //   rootPath: './public',
    //   serveRoot: '/public',
    // }),
    ConfigModule.forRoot({
      load: [configuration],
      // validationSchema,
      isGlobal: true,
      cache: true, // Cache the configuration to avoid repeated AWS calls
    }),
    QueueConfig,
    JwtConfig,
    MailConfig,
    QueueModuleConfig,
    bullboardConfig,
    HttpModule,
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [
    AuthController,
    UserController,
    PlanController,
    HealthController,
    BaseController,
    SubscriptionController,
    JobRoleController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
    UserService,
    RoleService,
    TermLegalService,
    PrismaService,
    PlanService,
    BaseService,
    SubscriptionService,
    JobRoleService,
  ],
})
export class AppModule {}
