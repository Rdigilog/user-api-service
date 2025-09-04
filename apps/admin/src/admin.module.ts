import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PlanController } from './controllers/plan.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtConfig, MailConfig, QueueConfig } from '@app/config';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RepositoryModule } from 'packages/repository';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisCacheOptions } from '@app/config/redis.config';
import { StatusInterceptor } from '@app/interceptors/status.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RoleController } from './controllers/role.controller';
import { TermLegalController } from './controllers/term-legal.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', 'uploads'),
      rootPath: './public',
      serveRoot: '/public',
    }),
    QueueConfig,
    JwtConfig,
    MailConfig,
    ConfigModule.forRoot(),
    HttpModule,
    RepositoryModule,
    // UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [PlanController, RoleController, TermLegalController],
  providers: [
    AdminService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
  ],
})
export class AdminModule {}
