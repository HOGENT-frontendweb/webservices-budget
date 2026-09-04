import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginRequestDto, LoginResponseDto } from './session.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AuthDelayInterceptor } from '../auth/interceptors/authDelay.interceptor';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Login',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @UseInterceptors(AuthDelayInterceptor)
  @Public()
  @Post()
  async signIn(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(loginDto);
    return { token };
  }
}
