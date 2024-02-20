import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/public.decorator';

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
}
