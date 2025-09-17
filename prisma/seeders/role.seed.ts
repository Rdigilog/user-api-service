import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function seed() {
  const roles = [
    { name: 'SUPER_ADMIN' },
    { name: 'ADMIN' },
    { name: 'CAREGIVER' },
    { name: 'CLIENT' },
    { name: 'FAMILY' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: role,
      update: {},
      create: role
    });
  }
}
seed()
  .then(() => {
    console.log('role data seeded');
  })
  .catch((error) => {
    console.error(error);
  });
