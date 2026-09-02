import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  CreatePlaceRequestDto,
  PlaceDetailResponseDto,
  PlaceListResponseDto,
  PlaceResponseDto,
  UpdatePlaceRequestDto,
} from './place.dto';
import { PlaceService } from './place.service';
import { PaginationQuery } from '../common/common.dto';
import { TransactionListResponseDto } from '../transaction/transaction.dto';
import { TransactionService } from '../transaction/transaction.service';
import { Role, type Session } from '../types/auth';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Places')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized - you need to be signed in',
})
@Controller('places')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private transactionService: TransactionService,
  ) {}

  @ApiOkResponse({
    description: 'Get all places',
    type: PlaceListResponseDto,
  })
  @Get()
  async getAllPlaces(): Promise<PlaceListResponseDto> {
    return this.placeService.getAll();
  }

  @ApiCreatedResponse({
    description: 'Create place',
    type: PlaceResponseDto,
  })
  @Post()
  @Roles(Role.ADMIN)
  async createPlace(
    @Body() createPlaceDto: CreatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.create(createPlaceDto);
  }

  @ApiOkResponse({
    description: 'Get place by ID',
    type: PlaceResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Place not found',
  })
  @Get(':id')
  async getPlaceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.getById(id);
  }

  @ApiOkResponse({
    description: 'Update place',
    type: PlaceResponseDto,
  })
  @Put(':id')
  @Roles(Role.ADMIN)
  async updatePlace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaceDto: UpdatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.update(id, updatePlaceDto);
  }

  @ApiNoContentResponse({
    description: 'Delete place',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async deletePlace(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.placeService.delete(id);
  }

  @Get('/:id/transactions')
  async getTransactionsByPlaceId(
    @CurrentUser() user: Session,
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<TransactionListResponseDto> {
    return this.transactionService.getAll(
      user.id,
      user.roles,
      paginationQuery,
      {
        placeId: id,
      },
    );
  }
}
