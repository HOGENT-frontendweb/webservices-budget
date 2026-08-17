import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreatePlaceRequestDto, UpdatePlaceRequestDto } from './place.dto';

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
