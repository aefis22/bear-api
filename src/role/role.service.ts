import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    if (await this.findByName(createRoleDto.name)) {
      throw new ConflictException('Role exist');
    }
    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        role_permission: {
          create: createRoleDto.permissions.map((permissionId) => ({
            permissions: { connect: { id: permissionId } },
          })),
        },
      },
    });
    return role;
  }

  async findAll() {
    const roles = await this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: {
        role_permission: {
          include: {
            permissions: true,
          },
        },
      },
    });
    const result = roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.role_permission.map((rp) => rp.permissions.name),
      };
    });
    return result;
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        role_permission: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!role) {
      throw new NotFoundException();
    }
    const result = {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.role_permission.map((rp) => rp.permissions.name),
    };
    return result;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException();
    }

    if (updateRoleDto.name != role.name) {
      if (await this.findByName(updateRoleDto.name)) {
        throw new ConflictException('Role exist');
      }
    }
    const updatedData = await this.prisma.role.update({
      where: { id },
      include: {
        role_permission: {
          include: {
            permissions: true,
          },
        },
      },
      data: {
        name: updateRoleDto.name,
        role_permission: {
          deleteMany: {},
          create: updateRoleDto.permissions.map((permissionId) => ({
            permissions: { connect: { id: permissionId } },
          })),
        },
      },
    });
    const result = {
      id: updatedData.id,
      name: updatedData.name,
      createdAt: updatedData.createdAt,
      updatedAt: updatedData.updatedAt,
      permissions: updatedData.role_permission.map((rp) => rp.permissions.name),
    };
    return result;
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException();
    }

    const deletedData = await this.prisma.role.delete({
      where: { id },
      include: { role_permission: true },
    });
    return deletedData;
  }

  async findByName(name: string) {
    const role = await this.prisma.role.findFirst({
      where: { name: name },
    });

    return role;
  }
}
