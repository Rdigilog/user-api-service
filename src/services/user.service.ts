/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { JobRole, Prisma } from '@prisma/client';

import { Queue } from 'bullmq';
import { PrismaService } from 'src/config/prisma.service';
import {
  InjectMailQueue,
  InjectSMSQueue,
} from 'src/decorators/queue.decorator';
import { mailSubjects, mailTemplates } from 'src/enums/subjects.enum';
import {
  InviteEmailFields,
  SendMailDto,
} from 'src/models/notification/mail.dto';
import {
  UpdateProfileDto,
  EmployeeDto,
} from 'src/models/onboarding/profile.dto';
import {
  InitiateRegistrationDto,
  PhoneNumberDTO,
  CompanyDetailsDTO,
  InviteUserDTO,
  SocialLoginRequest,
} from 'src/models/onboarding/SignUp.dto';
import { OtpService } from 'src/utils/services/otp.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { UtilsService } from 'src/utils/services/utils.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../config/config.keys';
import { InjectFileRemovalQueue } from 'src/queue/src/decorators/queue.decorator';
// import { LoginDTO } from 'src/models/onboarding/Login.dto';
// import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
  constructor(
    @InjectMailQueue() private mailQueue: Queue,
    @InjectSMSQueue() private smsQueue: Queue,
    @InjectFileRemovalQueue() private fileRemovalQueue: Queue,
    private readonly utilsService: UtilsService,
    private readonly otpService: OtpService,
    private readonly responseService: ResponsesService,
    private readonly userConfigService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // super(userConfigService);
  }

  async list(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    role?: string,
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.ProfileWhereInput = {};
      if (search) {
        filter.OR = [];
      }

      if (role) {
        filter.user = { type: role };
      }

      const result = await this.prisma.profile.findMany({
        where: filter,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              active: true,
              verified: true,
              phoneNumber: true,
              deleted: true,
              userRole: {
                select: {
                  role: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      // if (result.length) {
      const totalItems = await this.prisma.profile.count({ where: filter });
      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );
      return { error: 0, body: paginatedProduct };
      // }
      // return { error: 1, body: 'No Employee(s) found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async companyList(
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    companyId: string,
    role?: string,
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const filter: Prisma.ProfileWhereInput = {
        user: {
          userRole: {
            some: { companyId },
          },
        },
      };
      if (search) {
        filter.OR = [];
      }

      if (role) {
        filter.user = { userRole: { some: { role: { name: role } } } };
      }

      const result = await this.prisma.profile.findMany({
        where: filter,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              active: true,
              verified: true,
              phoneNumber: true,
              userRole: {
                select: {
                  role: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      // if (result.length) {
      const totalItems = await this.prisma.profile.count({ where: filter });
      const paginatedProduct = this.responseService.pagingData(
        { result, totalItems },
        page,
        limit,
      );
      return { error: 0, body: paginatedProduct };
      // }
      // return { error: 1, body: 'No Employee(s) found' };
    } catch (e) {
      console.error(e);
      return this.responseService.errorHandler(e);
    }
  }

  async createAccount(payload: InitiateRegistrationDto) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: { email: payload.businessEmail },
        });
        if (user && user.verified) {
          throw new Error('Email already registered');
        }
        if (user && !user.verified) {
          return this.sendOtp(user.email as string);
        }
        const password = await this.utilsService.hashPassword(
          payload.password as string,
          10,
        );
        const company = await tx.company.create({
          data: {
            email: payload.businessEmail as string,
            heardAboutUs: payload.heardAboutUs,
          },
        });
        const userCreateInput: Prisma.UserCreateInput = {
          email: payload.businessEmail,
          password,
          userRole: {
            create: {
              role: {
                connectOrCreate: {
                  where: { name: 'ADMIN' },
                  create: { name: 'ADMIN' },
                },
              },
              company: {
                connect: {
                  id: company.id,
                },
              },
            },
          },
          profile: {
            create: {
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.businessEmail,
              employee: {
                create: {
                  companyId: company.id,
                  bankInformation: {
                    create: {},
                  },
                  jobInformation: {
                    create: {},
                  },
                  emergencyContact: {
                    create: {},
                  },
                },
              },
            },
          },
        };
        const result = await tx.user.create({
          data: userCreateInput,
        });
        return await this.sendOtp(result.email as string);
      });
      return result;
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async socialAuth(payload: SocialLoginRequest) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const company = await tx.company.upsert({
          where: { email: payload.email },
          create: {
            email: payload.email,
            // heardAboutUs: payload.heardAboutUs,
          },
          update: {},
        });

        const result = await tx.user.upsert({
          where: { email: payload.email },
          update: {},
          create: {
            email: payload.email,
            active: true,
            verified: true,
            providerId: payload.providerId,
            provider: payload.provider,
            userRole: {
              create: {
                role: {
                  connectOrCreate: {
                    where: { name: 'ADMIN' },
                    create: { name: 'ADMIN' },
                  },
                },
                company: {
                  connect: {
                    id: company.id,
                  },
                },
              },
            },
            profile: {
              create: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                employee: {
                  create: {
                    companyId: company.id,
                    bankInformation: {
                      create: {},
                    },
                    jobInformation: {
                      create: {},
                    },
                    emergencyContact: {
                      create: {},
                    },
                  },
                },
              },
            },
          },
        });
        return result;
      });
      return result;
    } catch (e) {
      Logger.log(e);
      return null;
      // return this.responseService.errorHandler(e);
    }
  }

  async addPhoneNumber(payload: PhoneNumberDTO, userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { phoneNumber: payload.phoneNumber },
      });

      await this.prisma.profile.update({
        where: { userId },
        data: { phoneNumber: payload.phoneNumber },
      });
      return this.sendOtpPhone(payload.phoneNumber);
    } catch (e) {
      return this.responseService.errorHandler(e);
      // console.error('Error creating account:', e);
    }
  }

  async addCompanyDetails(payload: CompanyDetailsDTO, companyId: string) {
    try {
      await this.prisma.company.update({
        where: { id: companyId },
        data: {
          ...(payload.companyName && { name: payload.companyName }),
          ...(payload.totalEmployee && {
            totalEmployee: payload.totalEmployee,
          }),
          ...(payload.industry && { industry: payload.industry }),
          ...(payload.resumptionTime && {
            resumptionTime: payload.resumptionTime,
          }),
          ...(payload.closingTime && { closingTime: payload.closingTime }),
          ...(payload.planId && {
            plan: payload.planId
              ? {
                  connect: {
                    id: payload.planId,
                  },
                }
              : undefined,
          }),
        },
      });

      if (payload.planId) {
        const plan = await this.prisma.plan.findUniqueOrThrow({
          where: { id: payload.planId },
        });
        const subscription = await this.prisma.subscription.upsert({
          where: {
            companyId,
          },
          update: {},
          create: {
            plan: {
              connect: {
                id: payload.planId,
              },
            },
            status: 'PENDING',
            users: plan.minimumUsers,
            nextBilling: this.utilsService.nextBilling(),
            totalAmount: plan.minimumUsers * plan.price,
            company: {
              connect: {
                id: companyId,
              },
            },
          },
        });

        const invoiceNo = this.utilsService.lisaUnique();
        // if (payload.planId != company.planId) {
        await this.prisma.billingHistory.create({
          data: {
            company: {
              connect: {
                id: companyId,
              },
            },
            invoiceNo: invoiceNo,
            plan: {
              connect: {
                id: payload.planId,
              },
            },
            amount: subscription.totalAmount,
            status: 'PENDING',
            date: new Date(),
          },
        });
      }
      // }
      return { error: 0, body: 'Company Details updated successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
      // console.error('Error creating account:', e);
    }
  }

  async findByUsername(username: any) {
    const result = await this.prisma.user.findFirstOrThrow({
      where: {
        OR: [
          { email: { equals: username, mode: 'insensitive' } },
          { phoneNumber: username },
        ],
      },
    });
    return result;
  }

  async findById(id: string, includePassword = false) {
    const result = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        active: true,
        deleted: true,
        profile: true,
        password: includePassword,
        userRole: {
          select: {
            companyId: true,
            role: {
              select: {
                id: true,
                name: true,
                rolePermission: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                aboutMe: true,
                heardAboutUs: true,
                totalEmployee: true,
                address: true,
              },
            },
          },
        },
      },
    });

    const userRole = result?.userRole.map((ur) => ({
      ...ur,
      role: {
        ...ur.role,
        rolePermission: ur.role.rolePermission.map((rp) => ({
          ...rp.permission,
        })),
      },
    }));

    return { ...result, userRole };
  }

  async updateUser(payload: any, id: string) {
    try {
      const result = await this.prisma.user.update({
        where: { id },
        data: payload,
        select: {
          email: true,
          phoneNumber: true,
          active: true,
          verified: true,
          phoneVerified: true,
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async updateProfile(payload: UpdateProfileDto, userId: string) {
    try {
      Logger.log('request payload to update user');
      Logger.log(payload);
      const result = await this.prisma.profile.update({
        where: { userId: userId },
        data: {
          ...payload,
        },
      });
      Logger.log('updated record');
      Logger.log(result);
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async invite(payload: InviteUserDTO, companyId: string, invitedBy: string) {
    try {
      const plainPassword = this.utilsService.randomString();
      const company = await this.prisma.company.findUniqueOrThrow({
        where: { id: companyId },
      });

      const role = await this.prisma.role.findUnique({
        where: { name: 'EMPLOYEE' },
      });
      let user = await this.prisma.user.findUnique({
        where: { email: payload.email },
        select: {
          id: true,
          verified: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          userRole: {
            select: { roleId: true, companyId: true },
          },
        },
      });
      let jobRole: JobRole | null = null;

      const inviteLink = this.utilsService.lisaUnique();
      const memberId = this.utilsService.lisaUnique();
      if (payload.roleId) {
        jobRole = await this.prisma.jobRole.findFirst({
          where: { id: payload.roleId },
        });
      }
      if (user) {
        const { userRole } = user;
        if (
          userRole.length &&
          userRole.some((role) => role.companyId === company.id)
        ) {
          return { error: 1, body: 'User already exists in this company' };
        }
        await this.prisma.userRole.create({
          data: {
            user: { connect: { id: user.id } },
            role: {
              connectOrCreate: {
                where: { id: role?.id },
                create: { name: 'EMPLOYEE' },
              },
            },
            company: {
              connect: {
                id: company.id,
              },
            },
          },
        });

        await this.prisma.employee.create({
          data: {
            inviteLink,
            employeeCode: memberId,
            profile: { connect: { userId: user.id } },
            company: { connect: { id: companyId } },
            jobInformation: {
              create: {
                jobRole:
                  jobRole && jobRole.id
                    ? {
                        connect: {
                          id: jobRole.id,
                        },
                      }
                    : undefined,
              },
            },
            bankInformation: {
              create: {},
            },
            emergencyContact: {
              create: {},
            },
          },
        });

        const invite = await this.prisma.invitation.create({
          data: {
            user: { connect: { id: user.id } },
            company: { connect: { id: company.id } },
            invitedByUser: { connect: { id: invitedBy } },
            email: payload.email,
            role: {
              connect: {
                id: role?.id,
              },
            },
            memberId,
            inviteLink,
          },
          include: {
            invitedByUser: {
              select: {
                profile: { select: { firstName: true, lastName: true } },
              },
            },
          },
        });

        const inviteEmailData: InviteEmailFields = {
          recipientName: user.profile?.firstName || '',
          recipientEmail: payload.email,
          inviteLink: `${this.userConfigService.get<string>(CONFIG_KEYS.FRONTEND_URL)}/auth/invitations/accept?inviteCode=${invite.inviteLink}`,
          companyName: company.name || '',
          inviterName: invite.invitedByUser?.profile?.firstName || '',
          roleName: role?.name || 'Employee',
          plainPassword: '',
          inviteCode: `${invite?.inviteLink}`,
        };

        const mailObject: SendMailDto = {
          to: payload.email,
          subject: mailSubjects.USER_INVITATION,
          template: mailTemplates.USER_INVITATION,
          content: inviteEmailData,
        };

        this.mailQueue.add('INVITATION', mailObject);
      } else {
        const hasnedPassword = await this.utilsService.hashPassword(
          plainPassword,
          10,
        );
        user = await this.prisma.user.create({
          data: {
            email: payload.email,
            verified: true,
            active: true,
            deleted: false,
            password: hasnedPassword,
            isPasswordReset: false,
            profile: {
              create: {
                firstName: '',
                lastName: '',
                email: payload.email,
                employee: {
                  create: {
                    inviteLink,
                    employeeCode: memberId,
                    jobInformation: {
                      create: {
                        jobRole: jobRole?.id
                          ? {
                              connect: {
                                id: jobRole.id,
                              },
                            }
                          : undefined,
                      },
                    },
                    emergencyContact: {
                      create: {},
                    },
                    company: {
                      connect: {
                        id: companyId,
                      },
                    },
                    branch: payload.branchId
                      ? {
                          create: {
                            branchId: payload.branchId,
                          },
                        }
                      : undefined,
                  },
                },
              },
            },
            userRole: {
              create: {
                role: {
                  connectOrCreate: {
                    where: { id: role?.id },
                    create: { name: 'EMPLOYEE' },
                  },
                },
                company: { connect: { id: company.id } },
              },
            },
          },
          select: {
            id: true,
            verified: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            userRole: {
              select: { roleId: true, companyId: true },
            },
          },
        });

        const invite = await this.prisma.invitation.create({
          data: {
            user: { connect: { id: user.id } },
            company: { connect: { id: company.id } },
            invitedByUser: { connect: { id: invitedBy } },
            email: payload.email,
            tempPassword: plainPassword,
            role: {
              connect: {
                id: role?.id,
              },
            },
            memberId,
            inviteLink,
          },
          include: {
            invitedByUser: {
              select: {
                profile: { select: { firstName: true, lastName: true } },
              },
            },
          },
        });

        const inviteEmailData: InviteEmailFields = {
          recipientName: user.profile?.firstName || '',
          recipientEmail: payload.email,
          inviteLink: `${this.userConfigService.get<string>(CONFIG_KEYS.FRONTEND_URL)}/auth/invitations/accept?inviteCode=${invite.inviteLink}`,
          companyName: company.name || '',
          inviterName: invite.invitedByUser?.profile?.firstName || '',
          roleName: role?.name || 'Employee',
          plainPassword: '',
          inviteCode: `${invite?.inviteLink}`,
        };
        const mailObject: SendMailDto = {
          to: payload.email,
          subject: mailSubjects.USER_INVITATION,
          template: mailTemplates.USER_INVITATION,
          content: inviteEmailData,
        };
        this.mailQueue.add('INVITATION', mailObject);
      }

      return { error: 0, body: 'Invite sent successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async invites(
    companyId: string,
    page: number,
    size: number,
    search: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const where: Prisma.InvitationWhereInput = {};
      if (search) {
        where.OR = [];
      }

      const invite = await this.prisma.invitation.findMany({
        skip: offset,
        take: limit,
        include: {
          invitedByUser: {
            select: {
              profile: { select: { firstName: true, lastName: true } },
            },
          },
          user: {
            select: {
              profile: { select: { firstName: true, lastName: true } },
            },
          },
          role: { select: { name: true } },
        },
        orderBy: { [sortBy]: sortDirection },
      });
      if (invite.length) {
        const totalItems = await this.prisma.invitation.count({ where });
        const paginatedInvite = this.responseService.pagingData(
          { result: invite, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedInvite };
      }
      return { error: 0, body: 'Invite sent successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async reinvite(inviteLink: string, companyId: string) {
    try {
      // const plainPassword = this.utilsService.randomString();
      const company = await this.prisma.company.findUniqueOrThrow({
        where: { id: companyId },
      });
      const invite = await this.prisma.invitation.findFirst({
        where: { inviteLink },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          invitedByUser: {
            select: {
              profile: { select: { firstName: true, lastName: true } },
            },
          },
          role: {
            select: { name: true },
          },
        },
      });
      const inviteEmailData: InviteEmailFields = {
        recipientName: invite?.user?.profile?.firstName || '',
        recipientEmail: invite?.email || '',
        inviteLink: `${this.userConfigService.get<string>(CONFIG_KEYS.FRONTEND_URL)}/auth/invitations/accept?inviteCode=${invite?.inviteLink}`,
        companyName: company.name || '',
        inviterName: invite?.invitedByUser?.profile?.firstName || '',
        roleName: invite?.role.name || 'Employee',
        plainPassword: invite?.tempPassword || '',
        inviteCode: `${invite?.inviteLink}`,
      };
      const mailObject: SendMailDto = {
        to: invite?.user?.email || '',
        subject: mailSubjects.USER_INVITATION,
        template: mailTemplates.USER_INVITATION,
        content: inviteEmailData,
      };
      this.mailQueue.add('INVITATION', mailObject);
      return { error: 0, body: 'Invite resent successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async acceptInvite(inviteLink: string) {
    try {
      const user = await this.prisma.invitation.findFirst({
        where: {
          inviteLink,
        },
        select: {
          inviteLink: true,
          memberId: true,
          user: {
            select: {
              id: true,
              email: true,
              phoneNumber: true,
              isPasswordReset: true,
              profile: {
                select: {
                  employee: {
                    where: {
                      inviteLink,
                    },
                    select: {
                      employeeCode: true,
                      inviteAccepted: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!user) {
        return {
          error: 1,
          body: `No invite found with this invite code ${inviteLink}`,
        };
      }

      if (user.user?.profile?.employee?.inviteAccepted) {
        return {
          error: 1,
          body: 'Invited already accepted',
        };
      }

      await this.prisma.employee.update({
        where: { inviteLink: user.inviteLink },
        data: {
          inviteAccepted: true,
        },
      });
      return { error: 0, body: 'Invite Accepted successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async sendOtp(email: string) {
    try {
      const otpCode = this.otpService.secretOTP();
      const maidData: SendMailDto = {
        to: email,
        subject: mailSubjects.ACCOUNT_ACTIVATION,
        template: mailTemplates.ACCOUNT_ACTIVATION,
        content: { code: otpCode.code, name: '' },
      };
      console.log('mail payload', maidData);
      await this.mailQueue.add('SEND_OTP', maidData);
      return { error: 0, body: { token: otpCode.secret } };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async sendOtpPhone(phoneNumber: string) {
    try {
      console.log('sending otp to ' + phoneNumber);
      const otpCode = this.otpService.secretOTP();
      const maidData = {
        to: phoneNumber,
        content: `Your One Time Password is  ${otpCode.code}`,
      };
      console.log('mail payload', maidData);
      await this.smsQueue.add('SEND_OTP', maidData);
      return { error: 0, body: { token: otpCode.secret } };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async updateJobInformation(
    payload: EmployeeDto,
    id: string,
    companyId: string,
  ) {
    try {
      // let fileUrl = '';
      // let passportIdUrl = '';
      // let proofOfAddressUrl = '';
      // let otherProofOfIdentificationUrl: string[] = [];
      // if (profilePicture) {
      //   const fileUploadResult =
      //     await this.fileUploadService.uploadPicture(profilePicture);
      //   fileUrl = fileUploadResult.url;
      // }
      // if (passportId) {
      //   const fileUploadResult =
      //     await this.fileUploadService.uploadPicture(passportId);
      //   passportIdUrl = fileUploadResult.url;
      // }
      // if (proofOfAddress) {
      //   const fileUploadResult =
      //     await this.fileUploadService.uploadPicture(proofOfAddress);
      //   proofOfAddressUrl = fileUploadResult.url;
      // }
      // if (otherProofOfIdentification?.length) {
      //   await Promise.all(
      //     otherProofOfIdentification.map(async (file) => {
      //       const fileUploadResult =
      //         await this.fileUploadService.uploadPicture(file);
      //       otherProofOfIdentificationUrl.push(fileUploadResult.url);
      //     }),
      //   );
      // }
      console.log(companyId);
      const employee: Prisma.EmployeeUpdateInput = {
        ...(payload.address && { address: payload.address }),
        ...(payload.phoneNumber && { phoneNumber: payload.phoneNumber }),
        ...(payload.maritalStatus && { maritalStatus: payload.maritalStatus }),
        ...(payload.bio && { bio: payload.bio }),
        ...(payload.interest && { interest: payload.interest }),
        ...(payload.gender && { gender: payload.gender }),
        ...(payload.countryCode && { countryCode: payload.countryCode }),
        ...(payload.religion && { religion: payload.religion }),
        ...(payload.altPhoneNumber && {
          altPhoneNumber: payload.altPhoneNumber,
        }),
        ...(payload.passportId && { passportId: payload.passportId }),
        ...(payload.proofOfAddress && {
          proofOfAddress: payload.proofOfAddress,
        }),
        ...(payload.otherProofOfIdentification?.length && {
          otherProofOfIdentification: payload.otherProofOfIdentification,
        }),
        ...(payload.dateOfBirth && { dateOfBirth: payload.dateOfBirth }),
        ...(payload.bloodGroup && { bloodGroup: payload.bloodGroup }),
        ...(payload.allergy && { allergy: payload.allergy }),

        // ...(payload.jobInformation && {
        //   jobInformation: {
        //     connectOrCreate: {
        //       where: { employeeId: userId }, // assuming jobInformation has employeeId FK
        //       create: { ...payload.jobInformation },
        //     },
        //     update: { ...payload.jobInformation },
        //   },
        // }),

        // ...(payload.emergencyContact && {
        //   emergencyContact: {
        //     connectOrCreate: {
        //       where: { employeeId: userId },
        //       create: { ...payload.emergencyContact },
        //     },
        //     update: { ...payload.emergencyContact },
        //   },
        // }),

        // ...(fileUrl && {
        //   profile: {
        //     update: { imageUrl: fileUrl },
        //   },
        // }),

        // ...(payload.bankInformation && {
        //   bankInformation: {
        //     connectOrCreate: {
        //       where: { employeeId: userId },
        //       create: { ...payload.bankInformation },
        //     },
        //     update: { ...payload.bankInformation },
        //   },
        // }),

        // ...(payload.branchIds?.length && {
        //   branch: {
        //     deleteMany: {},
        //     createMany: {
        //       data: payload.branchIds.map((id) => ({ branchId: id })),
        //     },
        //   },
        // }),

        // ...(payload.departmentIds?.length && {
        //   department: {
        //     deleteMany: {},
        //     createMany: {
        //       data: payload.departmentIds.map((id) => ({ departmentId: id })),
        //     },
        //   },
        // }),
      };

      // if(payload.profilePicture){
      //   await this.profile.update({
      //     where:{
      //       employee:{}
      //     }
      //   })
      // }

      if (payload.jobInformation) {
        const { jobRoleId, ...rest } = payload.jobInformation;
        await this.prisma.jobInformation.upsert({
          where: { employeeId: id },
          update: {
            ...payload.jobInformation,
            jobRoleId: jobRoleId && jobRoleId != '' ? jobRoleId : undefined,
          },
          create: {
            ...rest,
            jobRole:
              jobRoleId && jobRoleId != ''
                ? {
                    connect: {
                      id: jobRoleId,
                    },
                  }
                : undefined,
            employee: {
              connect: {
                id: id,
              },
            },
          },
        });
      }

      if (payload.emergencyContact) {
        await this.prisma.emergencyContact.upsert({
          where: { employeeId: id },
          update: payload.emergencyContact,
          create: {
            ...payload.emergencyContact,
            employee: {
              connect: {
                id: id,
              },
            },
          },
        });
      }

      if (payload.bankInformation) {
        await this.prisma.bankInformation.upsert({
          where: { employeeId: id },
          update: payload.bankInformation,
          create: {
            ...payload.bankInformation,
            employee: {
              connect: {
                id,
              },
            },
          },
        });
      }

      const result = await this.prisma.employee.update({
        where: {
          id: id,
          // userId_companyId: {
          //   userId,
          //   companyId,
          // },
        },
        data: employee,
        include: {
          jobInformation: {
            include: {
              jobRole: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          bankInformation: true,
          emergencyContact: true,
          branch: true,
        },
        // create: {
        //   ...employee as any,
        //   profile: { connect: { userId } },
        //   company: { connect: { id: companyId } },
        // },
      });

      if (payload.profilePicture) {
        await this.prisma.profile.updateMany({
          where: { employee: { id } },
          data: { imageUrl: payload.profilePicture },
        });
      }

      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async removeProfilePic(userId: string) {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { userId },
      });
      this.fileRemovalQueue.add('REMOVE_PROFILE_PIC', profile?.imageUrl);
      const result = await this.prisma.profile.update({
        where: { userId },
        data: { imageUrl: null },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async view(userId: string) {
    try {
      const result = await this.prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              active: true,
              verified: true,
              phoneVerified: true,
              deleted: true,
              userRole: {
                select: {
                  role: {
                    select: { id: true, name: true },
                  },
                },
              },
            },
          },
          employee: {
            include: {
              jobInformation: {
                include: {
                  jobRole: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              emergencyContact: true,
              bankInformation: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
              department: {
                select: {
                  department: true,
                },
              },
              branch: {
                select: {
                  branch: true,
                },
              },
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async archiveUser(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      if (!user) {
        return { error: 1, body: 'No Record found' };
      }
      if (user.deleted) {
        return { error: 1, body: 'Account is already archived' };
      }
      await this.prisma.user.update({
        where: { id: userId },
        data: { deleted: true, deletedAt: new Date() },
      });
      return { error: 0, body: 'Archived successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async unarchiveUser(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      if (!user) {
        return { error: 1, body: 'No Record found' };
      }
      if (!user.deleted) {
        return { error: 1, body: 'Account is not archived' };
      }
      await this.prisma.user.update({
        where: { id: userId },
        data: { deleted: false, deletedAt: new Date() },
      });
      return { error: 0, body: 'unarchived successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async findComapnyById(companyId: string) {
    return await this.prisma.company.findUnique({
      where: { id: companyId },
    });
  }

  async userPermissions(userId: string, companyId: string) {
    try {
      const result = await this.prisma.permission.findMany({
        where: {
          permissionRolePermission: {
            some: {
              role: {
                userRoles: {
                  some: {
                    userId,
                    companyId,
                  },
                },
              },
            },
          },
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }
}
