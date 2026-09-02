import { CreateUser, User } from '../types/user';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserListResponseDto {
  items: PublicUserResponseDto[];
}

export class PublicUserResponseDto implements Omit<
  User,
  'passwordHash' | 'roles'
> {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class CreateUserRequestDto implements Pick<CreateUser, 'name'> {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
export class UpdateUserRequestDto extends CreateUserRequestDto {}
