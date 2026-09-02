import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTransactionRequestDto,
  TransactionListResponseDto,
  TransactionQueryDto,
  TransactionResponseDto,
  UpdateTransactionRequestDto,
} from './transaction.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { and, asc, count, desc, eq, like } from 'drizzle-orm';
import { places, transactions, users } from '../drizzle/schema';
import { Role } from '../types/auth';

interface GetAllTransactionFilters {
  placeId?: number;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(
    userId: number,
    roles: string[],
    { page = 1, pageSize = 10, search = '' }: TransactionQueryDto,
    filters?: GetAllTransactionFilters,
  ): Promise<TransactionListResponseDto> {
    const whereConditions = [];

    if (filters?.placeId) {
      whereConditions.push(eq(transactions.placeId, filters.placeId));
    }

    if (search) {
      whereConditions.push(like(places.name, `%${search}%`));
    }

    if (!roles.includes(Role.ADMIN)) {
      whereConditions.push(eq(transactions.userId, userId));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const countQuery = this.db
      .select({ count: count() })
      .from(transactions)
      .innerJoin(places, eq(transactions.placeId, places.id))
      .where(whereClause);

    const dataQuery = this.db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        date: transactions.date,
        place: places,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(transactions)
      .innerJoin(places, eq(transactions.placeId, places.id))
      .innerJoin(users, eq(transactions.userId, users.id))
      .where(whereClause)
      .orderBy(desc(transactions.date), asc(transactions.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [countResult, items] = await Promise.all([countQuery, dataQuery]);

    return {
      items,
      page,
      pageSize,
      total: countResult[0]?.count ?? 0,
    };
  }

  async getById(
    userId: number,
    roles: string[],
    id: number,
  ): Promise<TransactionResponseDto> {
    const whereCondition = roles.includes(Role.ADMIN)
      ? eq(transactions.id, id)
      : and(eq(transactions.id, id), eq(transactions.userId, userId));

    const transaction = await this.db.query.transactions.findFirst({
      columns: {
        id: true,
        amount: true,
        date: true,
      },
      where: whereCondition,
      with: {
        place: true,
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`No transaction with this id exists`);
    }

    return transaction;
  }

  async create(
    userId: number,
    { amount, date, placeId }: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const [newTransaction] = await this.db
      .insert(transactions)
      .values({
        amount,
        date,
        placeId,
        userId,
      })
      .$returningId();

    return this.getById(userId, [Role.USER], newTransaction.id);
  }

  async updateById(
    userId: number,
    id: number,
    { amount, date, placeId }: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    await this.db
      .update(transactions)
      .set({
        amount,
        date,
        placeId,
      })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));

    return this.getById(userId, [Role.USER], id);
  }

  async deleteById(userId: number, id: number): Promise<void> {
    const [result] = await this.db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));

    if (result.affectedRows === 0) {
      throw new NotFoundException('No transaction with this id exists');
    }
  }
}
