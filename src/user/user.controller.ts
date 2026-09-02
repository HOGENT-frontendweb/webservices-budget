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
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../types/auth';

@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(): Promise<UserListResponseDto> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<PublicUserResponseDto> {
    return this.userService.getById(id);
  }

  @Post()
  async registerUser(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.register(registerDto);
    return { token };
  }

  @Put(':id')
  async updateUserById(
    @Param('id') id: number,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<PublicUserResponseDto> {
    return this.userService.updateById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(@Param('id') id: number): Promise<void> {
    return this.userService.deleteById(id);
  }

  @Get('/:id/favoriteplaces')
  async getFavoritePlaces(
    @Param('id') id: string,
  ): Promise<PlaceResponseDto[]> {
    return this.placeService.getFavoritePlacesByUserId(Number(id));
  }
}
