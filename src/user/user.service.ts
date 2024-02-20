import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { User } from './entities/user.entity';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.findByEmail(createUserDto.email)) {
      throw new ConflictException('Email is exist');
    }
    const user = await this.prisma.users.create({
      data: {
        ...createUserDto,
        id: uuid(),
        password: await hash(createUserDto.password, 10),
      },
    });
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerifiedAt: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`The data with id ${id} is not found`);
    }
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`The data with id ${id} is not found`);
    }

    if (updateUserDto.email != user.email) {
      if (await this.findByEmail(updateUserDto.email)) {
        throw new ConflictException('Email is exist');
      }
    }
    const updatedData = await this.prisma.users.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: await hash(updateUserDto.password, 10),
      },
    });
    const { password, ...result } = updatedData;
    return result;
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`The data with id ${id} is not found`);
    }
    const deletedData = await this.prisma.users.delete({
      where: { id },
    });
    const { password, ...result } = deletedData;
    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    return user;
  }
}
