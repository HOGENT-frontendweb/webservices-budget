import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { PlaceService } from '../place/place.service';
import { PlaceResponseDto } from '../place/place.dto';
import {
  UpdateUserRequestDto,
  UserListResponseDto,
  PublicUserResponseDto,
  RegisterUserRequestDto,
} from './user.dto';
import { UserService } from './user.service';
import { LoginResponseDto } from '../session/session.dto';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/roles';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import { type Session } from '../types/auth';
import { ParseUserIdPipe } from '../auth/decorators/parseUserId.pipe';
import { AuthDelayInterceptor } from '../auth/interceptors/authDelay.interceptor';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly placeService: PlaceService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(): Promise<UserListResponseDto> {
    return this.userService.getAll();
  }

  @Get(':id')
  @UseGuards(CheckUserAccessGuard)
  async getUserById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<PublicUserResponseDto> {
    const userId = id === 'me' ? user.id : id;
    return await this.userService.getById(userId);
  }

  @Post()
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  async registerUser(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.register(registerDto);
    return { token };
  }

  @Put(':id')
  @UseGuards(CheckUserAccessGuard)
  async updateUserById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<PublicUserResponseDto> {
    return await this.userService.updateById(id === 'me' ? user.id : id, dto);
  }

  @Delete(':id')
  @UseGuards(CheckUserAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    return await this.userService.deleteById(id === 'me' ? user.id : id);
  }

  @Get('/:id/favoriteplaces')
  async getFavoritePlaces(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlaceResponseDto[]> {
    return this.placeService.getFavoritePlacesByUserId(id);
  }
}
