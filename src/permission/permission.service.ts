import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    if (await this.findByName(createPermissionDto.name)) {
      throw new ConflictException('Permission exist');
    }
    const permission = await this.prisma.permission.create({
      data: {
        name: createPermissionDto.name,
      },
    });
    return permission;
  }

  async findAll() {
    const permissions = this.prisma.permission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return permissions;
  }

  findOne(id: string) {
    const permission = this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException();
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException();
    }
    if (updatePermissionDto.name != permission.name) {
      if (await this.findByName(updatePermissionDto.name)) {
        throw new ConflictException('Permission exist');
      }
    }
    const updatedData = this.prisma.permission.update({
      where: { id },
      data: { name: updatePermissionDto.name },
    });
    return updatedData;
  }

  async remove(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException();
    }
    const deletedData = this.prisma.permission.delete({
      where: { id },
    });
    return deletedData;
  }

  async findByName(name: string) {
    const permission = await this.prisma.permission.findFirst({
      where: { name: name },
    });

    return permission;
  }
}
