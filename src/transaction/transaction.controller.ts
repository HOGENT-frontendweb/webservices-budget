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
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all transactions',
    type: TransactionListResponseDto,
  })
  @Get()
  async getAllTransactions(
    @CurrentUser() user: Session,
  ): Promise<TransactionListResponseDto> {
    return await this.transactionService.getAll(user.id, user.roles);
  }

  @ApiResponse({
    status: 201,
    description: 'Create transaction',
    type: TransactionResponseDto,
  })
  @Post()
  async createTransaction(
    @CurrentUser() user: Session,
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(user.id, createTransactionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get transaction by Id',
    type: TransactionResponseDto,
  })
  @Get(':id')
  async getTransactionById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.getById(id, user.id, user.roles);
  }

  @ApiResponse({
    status: 200,
    description: 'Update transaction',
    type: TransactionResponseDto,
  })
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

  @ApiResponse({
    status: 204,
    description: 'Delete transaction',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    return this.transactionService.deleteById(id, user.id);
  }
}
