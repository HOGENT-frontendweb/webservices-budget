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
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserListResponseDto,
  PublicUserResponseDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private placeService: PlaceService,
    private userService: UserService,
  ) {}

  @Get()
  async getAllUsers(): Promise<UserListResponseDto> {
    return this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<PublicUserResponseDto> {
    return this.userService.getById(id);
  }

  @Post()
  async createUser(
    @Body() dto: CreateUserRequestDto,
  ): Promise<PublicUserResponseDto> {
    return this.userService.create(dto);
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
