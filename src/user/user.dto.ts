import { CreateUser, User } from '../types/user';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
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

export class RegisterUserRequestDto implements Pick<
  CreateUser,
  'name' | 'email'
> {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

export class UpdateUserRequestDto implements Pick<
  CreateUser,
  'name' | 'email'
> {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsEmail()
  email: string;
}
