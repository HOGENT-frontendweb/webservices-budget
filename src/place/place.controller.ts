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
  ParseIntPipe
} from '@nestjs/common';
import { PlaceService } from './place.service';
import {
  CreatePlaceRequestDto,
  UpdatePlaceRequestDto,
  PlaceListResponseDto,
  PlaceDetailResponseDto,
} from './place.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  async getAllPlaces(): Promise<PlaceListResponseDto> {
    return this.placeService.getAll();
  }

  @Get(':id')
  async getPlaceById(@Param('id', ParseIntPipe) id: number): Promise<PlaceDetailResponseDto> {
    return this.placeService.getById(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createPlace(
    @Body() createPlaceDto: CreatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.create(createPlaceDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async updatePlace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaceDto: UpdatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.updateById(id, updatePlaceDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlace(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.placeService.deleteById(id);
  }
}
