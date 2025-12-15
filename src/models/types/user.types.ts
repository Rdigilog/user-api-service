import { Company, Prisma } from '@prisma/client';

export type LoggedInUser = Prisma.UserGetPayload<{
  include: {
    profile: true;
    userRole: {
      select: {
        companyId: true;
        company: true;
        role: true;
      };
    };
  };
}>;

export type activeCompaany = Company;
