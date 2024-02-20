import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(authDto: AuthDto) {
    const user = await this.userService.findByEmail(authDto.email);
    if (user && (await compare(authDto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException();
  }
}
