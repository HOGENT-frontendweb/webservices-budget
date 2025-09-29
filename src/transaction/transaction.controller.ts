// src/transactions/transaction.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  TransactionResponseDto,
  TransactionListResponseDto,
} from './transaction.dto';

@Controller('transactions')
export class TransactionController {
  @Get()
  async getAllTransactions(): Promise<TransactionListResponseDto> {
    throw new Error('Not implemented');
  }

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: number,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Param('id') id: number): Promise<void> {
    throw new Error('Not implemented');
  }
}
