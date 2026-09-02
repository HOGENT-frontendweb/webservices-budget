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
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, type Session } from '../types/auth';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  @ApiOkResponse({
    description: 'Get all users',
    type: UserListResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(): Promise<UserListResponseDto> {
    return this.userService.getAll();
  }

  @ApiOkResponse({
    description: 'Get user by ID',
    type: PublicUserResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
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

  @ApiOkResponse({
    description: 'Register',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post()
  @Public()
  async registerUser(
    @Body() registerDto: RegisterUserRequestDto,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.register(registerDto);
    return { token };
  }

  @ApiOkResponse({
    description: 'Update user by ID',
    type: PublicUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
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

  @ApiNoContentResponse({
    description: 'Delete user',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckUserAccessGuard)
  async deleteUserById(
    @Param('id', ParseUserIdPipe) id: 'me' | number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    return await this.userService.deleteById(id === 'me' ? user.id : id);
  }

  @ApiOkResponse({
    description: 'Get the favorite places of a user',
    type: PlaceListResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'me',
  })
  @Get('/:id/favoriteplaces')
  @UseGuards(CheckUserAccessGuard)
  async getFavoritePlaces(
    @Param('id', ParseUserIdPipe) id: number | 'me',
    @CurrentUser() user: Session,
  ): Promise<PlaceListResponseDto> {
    const userId = id === 'me' ? user.id : id;
    return this.placeService.getFavoritePlacesByUserId(userId);
  }
}
