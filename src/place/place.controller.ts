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

import {
  CreatePlaceRequestDto,
  PlaceListResponseDto,
  PlaceResponseDto,
  UpdatePlaceRequestDto,
} from './place.dto';
import { PlaceService } from './place.service';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  async getAllPlaces(): Promise<PlaceListResponseDto> {
    return this.placeService.getAll();
  }

  @Post()
  async createPlace(
    @Body() createPlaceDto: CreatePlaceRequestDto,
  ): Promise<PlaceResponseDto> {
    return this.placeService.create(createPlaceDto);
  }

  @Get(':id')
  async getPlaceById(@Param('id') id: string): Promise<PlaceResponseDto> {
    return this.placeService.getById(Number(id));
  }

  @Put(':id')
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceRequestDto,
  ): Promise<PlaceResponseDto> {
    return this.placeService.update(Number(id), updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlace(@Param('id') id: string): Promise<void> {
    return this.placeService.delete(Number(id));
  }
}
