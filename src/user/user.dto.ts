import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UserListResponseDto {
  items: UserResponseDto[];
}

export class UserResponseDto {
  id: number;
  name: string;
}

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}

export class UpdateUserRequestDto extends CreateUserRequestDto {}
