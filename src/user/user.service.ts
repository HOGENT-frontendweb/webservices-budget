import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserListResponseDto,
  UserResponseDto,
} from './user.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<UserListResponseDto> {
    const items = await this.db.query.users.findMany();
    return { items };
  }

  async getById(id: number): Promise<UserResponseDto> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundException('No user with this id exists');
    }

    return user;
  }

  async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    const [newUser] = await this.db.insert(users).values(dto).$returningId();
    return this.getById(newUser.id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(users).where(eq(users.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('No user with this id exists');
    }
  }

  async updateById(
    id: number,
    changes: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    await this.db.update(users).set(changes).where(eq(users.id, id));

    return this.getById(id);
  }
}
