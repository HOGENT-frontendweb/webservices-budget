import { Injectable } from '@nestjs/common';
import {
  CreateTransactionRequestDto,
  TransactionListResponseDto,
  TransactionResponseDto,
  UpdateTransactionRequestDto,
} from './transaction.dto';

@Injectable()
export class TransactionService {
  async getAll(): Promise<TransactionListResponseDto> {
    throw new Error('Not implemented');
  }

  async getById(id: number): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  async create(
    dto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  async updateById(
    id: number,
    { amount, date, placeId, userId }: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  async deleteById(id: number): Promise<void> {
    throw new Error('Not implemented');
  }
}
