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
  Query,
} from '@nestjs/common';

import {
  CreatePlaceRequestDto,
  PlaceDetailResponseDto,
  PlaceListResponseDto,
  UpdatePlaceRequestDto,
} from './place.dto';
import { PlaceService } from './place.service';
import { PaginationQuery } from '../common/common.dto';
import { TransactionListResponseDto } from '../transaction/transaction.dto';
import { TransactionService } from '../transaction/transaction.service';

@Controller('places')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private transactionService: TransactionService,
  ) {}

  @Get()
  async getAllPlaces(): Promise<PlaceListResponseDto> {
    return this.placeService.getAll();
  }

  @Post()
  async createPlace(
    @Body() createPlaceDto: CreatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.create(createPlaceDto);
  }

  @Get(':id')
  async getPlaceById(@Param('id') id: string): Promise<PlaceDetailResponseDto> {
    return this.placeService.getById(Number(id));
  }

  @Put(':id')
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.update(Number(id), updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlace(@Param('id') id: string): Promise<void> {
    return this.placeService.delete(Number(id));
  }

  @Get('/:id/transactions')
  async getTransactionsByPlaceId(
    @Param('id') id: string,
    @Query() paginationQuery: PaginationQuery,
  ): Promise<TransactionListResponseDto> {
    return this.transactionService.getAll(paginationQuery, {
      placeId: Number(id),
    });
  }
}
