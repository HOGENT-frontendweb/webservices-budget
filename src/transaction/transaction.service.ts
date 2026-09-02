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

  async getById(id: number): Promise<TransactionResponseDto> {
    const transaction = await this.db.query.transactions.findFirst({
      columns: {
        id: true,
        amount: true,
        date: true,
      },
      where: eq(transactions.id, id),
      with: {
        place: true,
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`No transaction with this id exists`);
    }

    return transaction;
  }

  async create(
    dto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const [newTransaction] = await this.db
      .insert(transactions)
      .values({
        ...dto,
        date: new Date(dto.date),
      })
      .$returningId();

    return this.getById(newTransaction.id);
  }

  async updateById(
    id: number,
    { amount, date, placeId, userId }: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    await this.db
      .update(transactions)
      .set({
        amount,
        date: new Date(date),
        placeId,
      })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db
      .delete(transactions)
      .where(eq(transactions.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('No transaction with this id exists');
    }
  }
}
