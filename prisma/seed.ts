import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
const prisma = new PrismaClient();
import { hash } from 'bcryptjs';

async function main() {
  const superadmin = await prisma.role.create({
    data: {
      name: 'Superadmin',
    },
  });
  const admin = await prisma.role.create({
    data: {
      name: 'Admin',
    },
  });
  const operator = await prisma.role.create({
    data: {
      name: 'Operator',
    },
  });
  for (let i = 0; i < 100; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: await hash('admin', 10),
      },
    });
    await prisma.user_role.create({
      data: {
        userId: user.id,
        roleId: i === 0 ? superadmin.id : admin.id,
      },
    });
  }

  await prisma.permission.createMany({
    data: [
      {
        name: 'user create',
      },
      {
        name: 'user read',
      },
      {
        name: 'user update',
      },
      {
        name: 'user delete',
      },
      {
        name: 'user profile',
      },
      {
        name: 'role create',
      },
      {
        name: 'role read',
      },
      {
        name: 'role update',
      },
      {
        name: 'role delete',
      },
      {
        name: 'permission create',
      },
      {
        name: 'permission read',
      },
      {
        name: 'permission update',
      },
      {
        name: 'permission delete',
      },
    ],
  });
  // console.log({ users, roles, permissions });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
