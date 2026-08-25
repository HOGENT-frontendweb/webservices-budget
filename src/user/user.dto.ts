export class UserListResponseDto {
  items: UserResponseDto[];
}

export class UserResponseDto {
  id: number;
  name: string;
}

export class CreateUserRequestDto {
  name: string;
}

export class UpdateUserRequestDto extends CreateUserRequestDto {}
