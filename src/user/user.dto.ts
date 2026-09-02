import { CreateUser, User } from '../types/user';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'nestjs-swagger-dto';
import { IsEmail } from 'class-validator';

export class UserListResponseDto {
  items: PublicUserResponseDto[];
}

export class PublicUserResponseDto implements Omit<
  User,
  'passwordHash' | 'roles'
> {
  @ApiProperty({
    description: 'User ID',
    minimum: 1,
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'User name',
    minLength: 2,
    maxLength: 255,
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@email.com',
    type: 'string',
    format: 'email',
  })
  @Expose()
  email: string;
}

export class RegisterUserRequestDto implements Pick<
  CreateUser,
  'name' | 'email'
> {
  @IsString({ name: 'name', minLength: 2, maxLength: 255 })
  name: string;

  @IsString({ name: 'email', example: 'user@email.com' })
  @IsEmail()
  email: string;

  @IsString({ name: 'password', minLength: 8, maxLength: 128 })
  password: string;
}

export class UpdateUserRequestDto implements Pick<
  CreateUser,
  'name' | 'email'
> {
  @IsString({ name: 'name', minLength: 2, maxLength: 255 })
  name: string;

  @IsString({
    name: 'email',
    example: 'user@email.com',
  })
  @IsEmail()
  email: string;
}
