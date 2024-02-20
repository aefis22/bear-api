import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller({
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Public()
  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
