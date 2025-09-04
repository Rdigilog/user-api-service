import { Global, Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { UserService } from './services/user.service';
import { UtilsModule } from '@app/utils';
import { MailModule, MailService } from '@app/mail';
import { QueueModuleConfig } from '@app/config/queue.module.config';
import { BaseService } from './services/base.service';
import { HttpModuleConfig } from '@app/config';
import { TwilioService } from '@app/utils/services/twilio.service';
import { LeaveService } from './services/leave.service';
import { TaskService } from './services/task.service';
import { CompanyService } from './services/company.service';
import { BranchService } from './services/branch.service';
import { NoteService } from './services/note.service';
import { AttendanceService } from './services/attendance.service';
import { RotaService } from './services/rota.service';
import { DemoService } from './services/demo.service';
import { PlanService } from './services/plan.service';
import { RoleService } from './services/role.service';
import { TermLegalService } from './services/term-legal.service';
import { RouteRegisteryService } from './services/route-registery.service';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { JobRoleService } from './services/job-role.service';
import { EmployeeService } from './services/employee.service';

@Module({
  imports: [QueueModuleConfig, MailModule, UtilsModule, HttpModuleConfig],
  providers: [
    RepositoryService,
    UserService,
    BaseService,
    MailService,
    TwilioService,
    LeaveService,
    TaskService,
    CompanyService,
    BranchService,
    NoteService,
    AttendanceService,
    RotaService,
    DemoService,
    PlanService,
    RoleService,
    TermLegalService,
    RouteRegisteryService,
    ConfigService,
    DiscoveryService,
    MetadataScanner,
    JobRoleService,
    EmployeeService,
  ],
  exports: [
    RepositoryService,
    UserService,
    BaseService,
    LeaveService,
    TaskService,
    CompanyService,
    BranchService,
    NoteService,
    AttendanceService,
    RotaService,
    DemoService,
    PlanService,
    RoleService,
    TermLegalService,
    JobRoleService,
    EmployeeService,
  ],
})
export class RepositoryModule {}
