import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
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
    return user;
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`The data with id ${id} is not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
    return updatedData;
  }

  async remove(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`The data with id ${id} is not found`);
    }
    const deletedData = await this.prisma.users.delete({
      where: { id },
    });
    return deletedData;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    return user;
  }
}
