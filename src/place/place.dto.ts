export class CreatePlaceRequestDto {
  name: string;
  rating: number;
}

export class UpdatePlaceRequestDto extends CreatePlaceRequestDto { }

export class PlaceResponseDto extends CreatePlaceRequestDto {
  id: number;
}

export class PlaceListResponseDto {
  items: PlaceResponseDto[];
}

