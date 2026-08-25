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
  Query,
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
  async getAllTransactions(
    @Query('pageSize') pageSize: string = '10',
    @Query('page') page: string = '1',
  ): Promise<TransactionListResponseDto> {
    return await this.transactionService.getAll(Number(page), Number(pageSize));
  }

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(createTransactionDto);
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.getById(Number(id));
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.updateById(Number(id), updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Param('id') id: string): Promise<void> {
    return this.transactionService.deleteById(Number(id));
  }
}
