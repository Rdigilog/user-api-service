import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtConfig, MailConfig, QueueConfig } from '@app/config';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheOptions } from '@app/config/redis.config';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { RepositoryModule } from 'packages/repository';
import { BranchController } from './controllers/branch.controller';
import { CompanyController } from './controllers/company.controller';
import { JobRoleController } from './controllers/job-role.controller';
import { EmployeeController } from './controllers/employee.controller';
import { UtilsModule } from '@app/utils';

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
    UtilsModule,
    CacheModule.registerAsync(RedisCacheOptions),
  ],
  controllers: [
    SettingsController,
    BranchController,
    CompanyController,
    JobRoleController,
    EmployeeController,
  ],
  providers: [SettingsService],
})
export class SettingsModule {}
