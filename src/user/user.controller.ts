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
} from '@nestjs/common';
import { PlaceService } from '../place/place.service';
import { PlaceListResponseDto } from '../place/place.dto';
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
import { ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly placeService: PlaceService,
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: UserListResponseDto,
  })
  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(): Promise<UserListResponseDto> {
    return this.userService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Get user by ID',
    type: PublicUserResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @Get(':id')
  @UseGuards(CheckUserAccessGuard)
  async getUserById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<PublicUserResponseDto> {
    const userId = id === 'me' ? user.id : id;
    return await this.userService.getById(userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Register',
    type: LoginResponseDto,
  })
  @Post()
  @Public()
  @UseInterceptors(AuthDelayInterceptor)
  async registerUser(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.register(registerDto);
    return { token };
  }

  @ApiResponse({
    status: 200,
    description: 'Update user by ID',
    type: PublicUserResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @Put(':id')
  @UseGuards(CheckUserAccessGuard)
  async updateUserById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<PublicUserResponseDto> {
    return await this.userService.updateById(id === 'me' ? user.id : id, dto);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete user',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @Delete(':id')
  @UseGuards(CheckUserAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    return await this.userService.deleteById(id === 'me' ? user.id : id);
  }

  @ApiResponse({
    status: 200,
    description: 'Get the favorite places of a user',
    type: PlaceListResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @Get('/:id/favoriteplaces')
  async getFavoritePlaces(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<PlaceListResponseDto> {
    return this.placeService.getFavoritePlacesByUserId(
      id === 'me' ? user.id : id,
    );
  }
}
