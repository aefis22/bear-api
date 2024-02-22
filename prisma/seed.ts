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

  // for (let i = 0; i < 100; i++) {
  //   await prisma.user.create({
  //     data: {
  //       name: faker.name.findName(),
  //       email: faker.internet.email(),
  //       password: await hash('admin', 10),
  //     },
  //   });
  // }

  const userSuperadmin = await prisma.user.create({
    data: {
      name: 'Superadmin',
      email: 'superadmin@superadmin.com',
      password: await hash('superadmin', 10),
    },
  });
  await prisma.user_role.create({
    data: {
      userId: userSuperadmin.id,
      roleId: superadmin.id,
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: await hash('admin', 10),
    },
  });
  await prisma.user_role.create({
    data: {
      userId: userAdmin.id,
      roleId: admin.id,
    },
  });

  const userOperator = await prisma.user.create({
    data: {
      name: 'Operator',
      email: 'operator@operator.com',
      password: await hash('operator', 10),
    },
  });
  await prisma.user_role.create({
    data: {
      userId: userOperator.id,
      roleId: operator.id,
    },
  });

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

  const permissions = await prisma.permission.findMany();
  permissions.map(async (permission) => {
    await prisma.role_permission.create({
      data: {
        roleId: superadmin.id,
        permissionId: permission.id,
      },
    });
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
