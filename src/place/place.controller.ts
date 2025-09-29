import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import {
  CreatePlaceRequestDto,
  UpdatePlaceRequestDto,
  PlaceListResponseDto,
  PlaceDetailResponseDto
} from './place.dto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  async getAllPlaces(): Promise<PlaceListResponseDto> {
    return this.placeService.getAll();
  }

  @Get(':id')
  async getPlaceById(@Param('id') id: string): Promise<PlaceDetailResponseDto> {
    return this.placeService.getById(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlace(
    @Body() createPlaceDto: CreatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.create(createPlaceDto);
  }

  @Put(':id')
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.updateById(Number(id), updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlace(@Param('id') id: string): Promise<void> {
    await this.placeService.deleteById(Number(id));
  }
}
