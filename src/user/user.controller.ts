import { Controller, Get, Param } from '@nestjs/common';
import { PlaceService } from '../place/place.service';
import { PlaceResponseDto } from '../place/place.dto';

@Controller('users')
export class UserController {
  constructor(private placeService: PlaceService) {}

  @Get('/:id/favoriteplaces')
  async getFavoritePlaces(
    @Param('id') id: string,
  ): Promise<PlaceResponseDto[]> {
    return this.placeService.getFavoritePlacesByUserId(Number(id));
  }
}
