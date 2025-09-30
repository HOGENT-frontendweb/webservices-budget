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
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(): Promise<TransactionListResponseDto> {
    return this.transactionService.getAll();
  }

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(createTransactionDto);
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: number,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.getById(id);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.updateById(id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Param('id') id: number): Promise<void> {
    return this.transactionService.deleteById(id);
  }
}
