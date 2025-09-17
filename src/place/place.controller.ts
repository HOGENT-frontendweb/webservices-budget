import {
  Body, Controller, Delete, Get, Param, Put, Post, HttpStatus, HttpCode
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceRequestDto, UpdatePlaceRequestDto, PlaceListResponseDto, PlaceResponseDto } from './place.dto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) { }

  @Get()
  getAllPlaces(): PlaceListResponseDto {
    return this.placeService.getAll();
  }

  @Get(':id')
  getPlaceById(@Param('id') id: string): PlaceResponseDto {
    return this.placeService.getById(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPlace(@Body() createPlaceDto: CreatePlaceRequestDto): PlaceResponseDto {
    return this.placeService.create(createPlaceDto);
  }

  @Put(':id')
  updatePlace(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceRequestDto): PlaceResponseDto {
    return this.placeService.updateById(Number(id), updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePlace(@Param('id') id: string): void {
    this.placeService.deleteById(Number(id));
  }
}
