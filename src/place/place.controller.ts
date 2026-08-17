import {
  Body,
  Controller,
  Delete,
  Get,
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
  ) {
    return `This action updates the place ${updatePlaceDto.name} with #${id}`;
  }

  @Delete(':id')
  deletePlace(@Param('id') id: string) {
    return `This action removes the place with id #${id}`;
  }
}
