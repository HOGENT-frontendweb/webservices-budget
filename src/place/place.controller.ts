import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CreatePlaceRequestDto } from './place.dto';

@Controller('places')
export class PlaceController {
  @Get()
  getAllPlaces(@Query('page') page = 1, @Query('limit') limit = 10) {
    return `This action returns all places. Limit ${limit}, page: ${page}`;
  }

  @Post()
  createPlace(@Body() createPlaceDto: CreatePlaceRequestDto): string {
    return `This action adds a new place ${createPlaceDto.name}`;
  }

  @Get(':id')
  getPlaceById(@Param('id') id: string): string {
    return `This action returns a #${id} place`;
  }
}
