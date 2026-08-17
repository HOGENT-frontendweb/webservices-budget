export class CreatePlaceRequestDto {
  name: string;
  rating: number;
}

export class UpdatePlaceRequestDto extends CreatePlaceRequestDto {}
