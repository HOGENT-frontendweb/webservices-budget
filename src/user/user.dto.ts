import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserListResponseDto {
  items: PublicUserResponseDto[];
}

export class PublicUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class RegisterUserRequestDto {
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

export class UpdateUserRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsEmail()
  email: string;
}
