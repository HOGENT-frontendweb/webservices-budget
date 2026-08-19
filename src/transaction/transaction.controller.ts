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
    throw new Error('Not implemented');
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Param('id') id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
