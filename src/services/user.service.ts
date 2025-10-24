
import { Injectable } from '@nestjs/common';
import { JobRole, Prisma } from '@prisma/client';

import { Queue } from 'bullmq';
import { PrismaService } from 'src/config/prisma.service';
import { InjectMailQueue, InjectSMSQueue } from 'src/decorators/queue.decorator';
import { mailSubjects, mailTemplates } from 'src/enums/subjects.enum';
import { InviteEmailFields, SendMailDto } from 'src/models/notification/mail.dto';
import { UpdateProfileDto, EmployeeDto } from 'src/models/onboarding/profile.dto';
import { InitiateRegistrationDto, PhoneNumberDTO, CompanyDetailsDTO, InviteUserDTO } from 'src/models/onboarding/SignUp.dto';
import { FileUploadService } from 'src/utils/services/file-upload.service';
import { OtpService } from 'src/utils/services/otp.service';
import { ResponsesService } from 'src/utils/services/responses.service';
import { UtilsService } from 'src/utils/services/utils.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../config/config.keys';
import { InjectFileRemovalQueue } from 'src/queue/src/decorators/queue.decorator';


@Injectable()
export class UserService extends PrismaService {
  constructor(
    @InjectMailQueue() private mailQueue: Queue,
    @InjectSMSQueue() private smsQueue: Queue,
    @InjectFileRemovalQueue() private fileRemovalQueue: Queue,
    // @InjectFileQueue() private fileQueue: Queue,
    private readonly utilsService: UtilsService,
    private readonly otpService: OtpService,
    private readonly responseService: ResponsesService,
    private readonly fileUploadService: FileUploadService,
    private readonly prismaService: PrismaService,
    private readonly userConfigService: ConfigService
  ) {
    super(userConfigService);
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

      const result = await this.profile.findMany({
        where: filter,
        include: {
          user: {
            select: {
              email: true,
              active: true,
              verified: true,
              phoneNumber: true,
              userRole: {
                select: { role: true },
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

      if (result.length) {
        const totalItems = await this.profile.count({ where: filter });
        const paginatedProduct = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedProduct };
      }
      return { error: 1, body: 'No Employee(s) found' };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
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
        filter.user = { type: role };
      }

      console.log(JSON.stringify(filter))

      const result = await this.profile.findMany({
        where: filter,
        include: {
          user: {
            select: {
              email: true,
              active: true,
              verified: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
        skip: offset,
        take: limit,
      });

      if (result.length) {
        const totalItems = await this.profile.count({ where: filter });
        const paginatedProduct = this.responseService.pagingData(
          { result, totalItems },
          page,
          limit,
        );
        return { error: 0, body: paginatedProduct };
      }
      return { error: 1, body: 'No Employee(s) found' };
    } catch (e) {
      console.error(e);
      return { error: 2, body: e.message };
    }
  }

  async createAccount(payload: InitiateRegistrationDto) {
    try {
      const result = await this.$transaction(async (tx) => {
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
          payload.password,
          10,
        );
        const company = await tx.company.create({
          data: {
            email: payload.businessEmail,
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
                  bankInformation: {},
                  jobInformation: {},
                  emergencyContact: {},
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

  async addPhoneNumber(payload: PhoneNumberDTO, userId: string) {
    try {
      await this.user.update({
        where: { id: userId },
        data: { phoneNumber: payload.phoneNumber },
      });

      await this.profile.update({
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

      await this.company.update({
        where: { id:companyId },
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
            plan: {
              connect: {
                id: payload.planId,
              },
            },
          }),
        },
      });

      if(payload.planId){
              const plan = await this.plan.findUniqueOrThrow({
        where: { id: payload.planId },
      });
        await this.subscription.upsert({
          where:{
            companyId
          },
          update:{},
          create:{
            plan:{
              connect:{
                id:payload.planId,
              }
            },
            status:'PENDING',
            users:plan.minimumUsers,
            nextBilling:this.utilsService.nextBilling(),
            totalAmount:plan.minimumUsers * plan.price,
            company:{
              connect:{
                id:companyId
              }
            }
          }
        })
      }
      return { error: 0, body: 'Company Details updated successfully' };
    } catch (e) {
      return this.responseService.errorHandler(e);
      // console.error('Error creating account:', e);
    }
  }

  async findByUsername(username: any) {
    const result = await this.user.findFirstOrThrow({
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
    return await this.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        active: true,
        deleted: true,
        profile: true,
        password: includePassword,
        userRole: {
          select: { companyId: true, role: true, company: true },
        },
      },
    });
  }

  async updateUser(payload: any, id: string) {
    try {
      const result = await this.user.update({
        where: { id },
        data: payload,
        select:{
          email:true, 
          phoneNumber:true,
          active:true,
          verified:true,
          phoneVerified:true,
        }
      });
      return { error: 0, body: result };
    } catch (e) {
      return { error: 2, message: 'User update failed.' };
    }
  }

  async updateProfile(
    payload: UpdateProfileDto,
    profilePicture: Express.Multer.File,
    userId: string,
  ) {
    try {
      const profile = await this.profile.findFirst({
        where: { userId }
      })
      let fileUrl = '';
      if (profilePicture) {
        this.fileRemovalQueue.add('REMOVE_PROFILE_PIC', profile?.imageUrl)
        const fileUploadResult =
          await this.fileUploadService.uploadPicture(profilePicture);
        // console.log(fileUploadResult)
        fileUrl = fileUploadResult.url;
      }
      const data: any = {
        ...(payload.firstName !== undefined && {
          firstName: payload.firstName,
        }),
        ...(payload.lastname !== undefined && { lastName: payload.lastname }),
        ...(payload.email !== undefined && { email: payload.email }),
        ...(payload.phoneNumber !== undefined && {
          phoneNumber: payload.phoneNumber,
        }),
        ...(fileUrl && { imageUrl: fileUrl }),
        // ...(payload.employeeId !== undefined && {
        //   employeeId: payload.employeeId,
        // }),
        // ...(payload.address !== undefined && { address: payload.address }),
        // ...(payload.maritalStatus !== undefined && {
        //   maritalStatus: payload.maritalStatus,
        // }),
        // ...(payload.bio !== undefined && { bio: payload.bio }),
        // ...(payload.interest !== undefined && { interest: payload.interest }),
        // ...(payload.Gender !== undefined && { Gender: payload.Gender }),
        // ...(payload.countryCode !== undefined && {
        //   countryCode: payload.countryCode,
        // }),
        // ...(payload.religion !== undefined && { religion: payload.religion }),
        // ...(payload.altPhoneNumber !== undefined && {
        //   altPhoneNumber: payload.altPhoneNumber,
        // }),
        // ...(payload.dateOfBirth !== undefined && {
        //   dateOfBirth: payload.dateOfBirth,
        // }),
        // ...(payload.bloodGroup !== undefined && {
        //   bloodGroup: payload.bloodGroup,
        // }),
        // ...(payload.allergy !== undefined && { allergy: payload.allergy }),
      };

      const result = await this.profile.update({
        where: { userId },
        data: {
          ...data,
          status: 'PENDING',
        },
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async invite(payload: InviteUserDTO, companyId: string, invitedBy: string) {
    try {
      const currentTime = new Date();
      const company = await this.company.findUniqueOrThrow({
        where: { id: companyId },
      });

      const role = await this.role.findUnique({
        where: { name: 'STAFF' },
      });
      let user = await this.user.findUnique({
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
      let jobRole:JobRole|null=null;
      if(payload.roleId){
        jobRole = await this.jobRole.findFirst({
         where:{id:payload.roleId}
       })
      }
      if (user) {
        const { userRole } = user;
        if (
          userRole.length &&
          userRole.some((role) => role.companyId === company.id)
        ) {
          return { error: 1, body: 'User already exists in this company' };
        }
        await this.userRole.create({
          data: {
            user: { connect: { id: user.id } },
            role: {
              connectOrCreate: {
                where: { name: payload.roleId },
                create: { name: payload.roleId },
              },
            },
            company: {
              connect: {
                id: company.id,
              },
            },
          },
        });
      } else {
        user = await this.user.create({
          data: {
            email: payload.email,
            verified: false,
            active: false,
            deleted: false,
            profile: {
              create: {
                firstName: '',
                lastName: '',
                email: payload.email,
                employee:{
                  create:{
                    jobInformation:{
                      create:{
                        jobRole: jobRole ? {
                          connect:{
                            id:jobRole.id
                          }
                        }:undefined
                      }
                    },
                    emergencyContact:{
                      create:{}
                    },
                    company:{
                      connect:{
                        id:companyId
                      }
                    }
                  }
                }
              },
            },
            userRole: {
              create: {
                role: { connect: { name: payload.roleId } },
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
      }

      const invite = await this.invitation.create({
        data: {
          user: { connect: { id: user.id } },
          company: { connect: { id: company.id } },
          invitedByUser: { connect: { id: invitedBy } },
          email: payload.email,
          role: {
            connect: {
              id: payload.roleId,
            },
          },
          memberId: payload.memberId,
          inviteLink: this.utilsService.lisaUnique() || "inviteLink",
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
        inviteLink: `${this.userConfigService.get<string>(CONFIG_KEYS.FRONTEND_URL)}/auth/register/?code=${invite.inviteLink}`,
        companyName: company.name || '',
        inviterName: invite.invitedByUser?.profile?.firstName || '',
        roleName: role?.name || 'Employee',
      };
      const mailObject: SendMailDto = {
        to: payload.email,
        subject: mailSubjects.USER_INVITATION,
        template: mailTemplates.USER_INVITATION,
        content: inviteEmailData,
      };
      this.mailQueue.add('INVITATION', mailObject);
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
    role?: string,
  ) {
    try {
      const { offset, limit } = this.responseService.pagination(page, size);
      const where: Prisma.InvitationWhereInput = {};
      if (search) {
        where.OR = [];
      }

      const invite = await this.invitation.findMany({
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
        const totalItems = await this.invitation.count({ where });
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
      const currentTime = new Date();
      const company = await this.company.findUniqueOrThrow({
        where: { id: companyId },
      });
      const invite = await this.invitation.findFirst({
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
        inviteLink: `${this.userConfigService.get<string>(CONFIG_KEYS.FRONTEND_URL)}/auth/register/?code=${invite?.inviteLink}`,
        companyName: company.name || '',
        inviterName: invite?.invitedByUser?.profile?.firstName || '',
        roleName: invite?.role.name || 'Employee',
      };
      const mailObject: SendMailDto = {
        to: invite?.user?.email || "",
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

  async getByInviteLink(inviteLink: string) {
    try {
      const user = await this.invitation.findFirst({
        where: {
          inviteLink,
        },
        select: {
          user: {
            select: {
              email: true,
              phoneNumber: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      return { error: 0, body: user };
    } catch (e) {
      return { error: 1, body: 'Invite Link expired or invalid' };
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
      console.log('mail payload', maidData)
      await this.mailQueue.add('SEND_OTP', maidData);
      return { error: 0, body: { token: otpCode.secret } };
    } catch (e) {
      return { error: 2, body: 'OTP sending failed.' };
    }
  }

  async sendOtpPhone(phoneNumber: string) {
    try {
      console.log('sending otp to ' + phoneNumber)
      const otpCode = this.otpService.secretOTP();
      const maidData = {
        to: phoneNumber,
        content: `Your One Time Password is  ${otpCode.code}`,
      };
      console.log('mail payload', maidData)
      await this.smsQueue.add('SEND_OTP', maidData);
      return { error: 0, body: { token: otpCode.secret } };
    } catch (e) {
      return { error: 2, body: e.message };
    }
  }

  async updateJobInformation(
    payload: EmployeeDto,
    userId: string,
    companyId: string,
  ) {
    try {
      const employee: Prisma.EmployeeUpdateInput = {
        ...(payload.address && { address: payload.address }),
        ...(payload.phoneNumber && { phoneNumber: payload.phoneNumber }),
        ...(payload.maritalStatus && { maritalStatus: payload.maritalStatus }),
        ...(payload.bio && { bio: payload.bio }),
        ...(payload.interest && { interest: payload.interest }),
        ...(payload.Gender && { Gender: payload.Gender }),
        ...(payload.countryCode && { countryCode: payload.countryCode }),
        ...(payload.religion && { religion: payload.religion }),
        ...(payload.altPhoneNumber && {
          altPhoneNumber: payload.altPhoneNumber,
        }),
        ...(payload.dateOfBirth && { dateOfBirth: payload.dateOfBirth }),
        ...(payload.bloodGroup && { bloodGroup: payload.bloodGroup }),
        ...(payload.allergy && { allergy: payload.allergy }),

        ...(payload.jobInformation && {
          jobInformation: {
            upsert: {
              create: {
                ...payload.jobInformation,
              },
              update: {
                ...payload.jobInformation,
              },
            },
          },
        }),

        ...(payload.emergencyContact && {
          emergencyContact: {
            upsert: {
              create: {
                ...payload.emergencyContact,
              },
              update: {
                ...payload.emergencyContact,
              },
            },
          },
        }),

        ...(payload.bankInformation && {
          bankInformation: {
            upsert: {
              create: {
                ...payload.bankInformation,
              },
              update: {
                ...payload.bankInformation,
              },
            },
          },
        }),
      };
      const result = await this.employee.upsert({
        where: {
          userId_companyId: {
            companyId,
            userId,
          },
        },
        update: employee,
        create: employee as any,
      });
      return { error: 0, body: result };
    } catch (e) {
      return this.responseService.errorHandler(e);
    }
  }

  async removeProfilePic(userId: string) {
    try {
      const profile = await this.profile.findFirst({
        where: { userId }
      })
      this.fileRemovalQueue.add('REMOVE_PROFILE_PIC', profile?.imageUrl)
      const result = await this.profile.update({
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
      const result = await this.profile.findUnique({
        where: { userId },
        include: {
          employee: {
            include: {
              jobInformation: true,
              emergencyContact: true,
              bankInformation: true,
              department: {
                select: {
                  department: true
                }
              },
              branch: {
                select: {
                  branch: true
                }
              }
            }
          }
        }
      })
      return { error: 0, body: result }
    } catch (e) {
      return this.responseService.errorHandler(e)
    }
  }
}
