import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { QueueConfig, MailConfig, JwtConfig } from '@app/config';
import { AuthController } from './controllers/auth.controller';
import { RepositoryModule } from 'packages/repository';
import { UtilsModule } from '@app/utils';
import { UserController } from './controllers/user.controller';
import { BaseController } from './controllers/base.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StatusInterceptor } from '@app/interceptors/status.interceptor';
import { FileController } from './controllers/file.controller';
import { RoleController } from '../../admin/src/controllers/role.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisCacheOptions } from '@app/config/redis.config';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    RepositoryModule,
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [
    // AppController,
    AuthController,
    UserController,
    // BaseController,
    // FileController,
    // RoleController,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
  ],
})
export class AppModule {}
