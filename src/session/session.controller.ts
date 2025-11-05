import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginRequestDto, LoginResponseDto } from './session.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AuthDelayInterceptor } from '../auth/interceptors/authDelay.interceptor';

@Controller('sessions')
export class SessionController {
  constructor(private authService: AuthService) {}

  @Post()
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  async signIn(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(loginDto);
    return { token };
  }
}
