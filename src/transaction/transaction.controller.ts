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
  ParseIntPipe,
} from '@nestjs/common';
import {
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  TransactionResponseDto,
  TransactionListResponseDto,
} from './transaction.dto';
import { TransactionService } from './transaction.service';
import { type Session } from '../types/auth';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(
    @CurrentUser() user: Session,
  ): Promise<TransactionListResponseDto> {
    return await this.transactionService.getAll(user.id, user.roles);
  }

  @Post()
  async createTransaction(
    @CurrentUser() user: Session,
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(user.id, createTransactionDto);
  }

  @Get(':id')
  async getTransactionById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.getById(id, user.id, user.roles);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
    @Body() updateTransactionDto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.updateById(
      id,
      user.id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    return this.transactionService.deleteById(id, user.id);
  }
}
