import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.userService.findByEmail(authDto.email);
    if (user && (await compare(authDto.password, user.password))) {
      const payload = { sub: user.id, username: user.email };
      const { password, ...result } = user;
      return {
        ...result,
        access_token: await this.jwtService.signAsync(payload, {
          secret: 'kmzway87aa',
          expiresIn: '7D',
        }),
        token_type: 'Bearer',
      };
    }

    throw new UnauthorizedException();
  }

  async register(createUserDto: CreateUserDto) {
    if (await this.userService.findByEmail(createUserDto.email)) {
      throw new ConflictException('Email is exist');
    }
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        id: uuid(),
        password: await hash(createUserDto.password, 10),
      },
    });
    const payload = { sub: user.id, username: user.email };
    const { password, ...result } = user;
    return {
      ...result,
      access_token: await this.jwtService.signAsync(payload, {
        secret: 'kmzway87aa',
        expiresIn: '7D',
      }),
      token_type: 'Bearer',
    };
  }
}
