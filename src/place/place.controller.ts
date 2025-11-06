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
  ParseIntPipe,
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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Places')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all places',
    type: PlaceListResponseDto,
  })
  @Get()
  async getAllPlaces(): Promise<PlaceListResponseDto> {
    return this.placeService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Get place by ID',
    type: PlaceDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Place not found',
  })
  @Get(':id')
  async getPlaceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.getById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Create place',
    type: PlaceDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createPlace(
    @Body() createPlaceDto: CreatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.create(createPlaceDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Update place',
    type: PlaceDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Place not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Put(':id')
  @Roles(Role.ADMIN)
  async updatePlace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaceDto: UpdatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    return this.placeService.updateById(id, updatePlaceDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete place',
  })
  @ApiResponse({
    status: 404,
    description: 'Place not found',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlace(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.placeService.deleteById(id);
  }
}
