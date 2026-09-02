import { CreateUser } from '../types/user';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserListResponseDto {
  items: UserResponseDto[];
}

export class UserResponseDto {
  id: number;
  name: string;
}

export class CreateUserRequestDto implements Pick<CreateUser, 'name'> {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
export class UpdateUserRequestDto extends CreateUserRequestDto {}
