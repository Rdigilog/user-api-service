import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function seed() {
  const result = await Promise.all(
    ['digiCare', 'digiTeam', 'digiCarePlus'].map(async (plan) => {
      await prisma.plan.create({
        data: {
          name: plan,
        },
      });
    }),
  );
  return result;
}

seed();
