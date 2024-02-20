import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isEmailExist = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (isEmailExist) {
      throw new ConflictException('Email is exist');
    }
    const user = await this.prisma.users.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      orderBy: { id: 'desc' },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`The data with id ${id} is not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`The data with id ${id} is not found`);
    }
    const updatedData = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
    return updatedData;
  }

  async remove(id: number) {
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
}
