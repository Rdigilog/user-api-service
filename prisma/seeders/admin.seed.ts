import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { genSalt, hash } from 'bcryptjs';
async function seedAdmin() {
  const salt = await genSalt(10);
  const hashedPassword = await hash('Password@1', salt);
  const role = await prisma.role.findFirst({
    where: {
      name: 'SUPER_ADMIN',
    },
  });
  if (!role) {
    return false;
  }
  console.log(role);
  await prisma.user.create({
    data: {
      email: 'info@digilog.com',
      phoneNumber: '+44223399',
      password: hashedPassword,
      active: true,
      userRole: {
        create: {
          roleId: role.id,
        },
      },
      profile: {
        create: {
          firstName: 'Super Admin',
          lastName:"Admin",
          email: 'info@digilog.com',
          phoneNumber: '08011223344',
          // address: 'Mabushi Abuja',
        },
      },
    },
  });
  return true;
}

seedAdmin()
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
