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
  getAllPlaces(): PlaceListResponseDto {
    return this.placeService.getAll();
  }

  @Post()
  createPlace(@Body() createPlaceDto: CreatePlaceRequestDto): PlaceResponseDto {
    return this.placeService.create(createPlaceDto);
  }

  @Get(':id')
  getPlaceById(@Param('id') id: string): PlaceResponseDto {
    return this.placeService.getById(Number(id));
  }

  @Put(':id')
  updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceRequestDto,
  ): PlaceResponseDto {
    return this.placeService.updateById(Number(id), updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePlace(@Param('id') id: string): void {
    this.placeService.deleteById(Number(id));
  }
}
