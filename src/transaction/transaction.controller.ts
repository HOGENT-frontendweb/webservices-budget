import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  TransactionResponseDto,
  TransactionListResponseDto,
  TransactionQueryDto,
} from './transaction.dto';
import { TransactionService } from './transaction.service';
import { type Session } from '../types/auth';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized - you need to be signed in',
})
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiOkResponse({
    description: 'Get all transactions',
    type: TransactionListResponseDto,
  })
  @Get()
  async getAllTransactions(
    @CurrentUser() user: Session,
    @Query() query: TransactionQueryDto,
  ): Promise<TransactionListResponseDto> {
    return await this.transactionService.getAll(user.id, user.roles, query);
  }

  @ApiCreatedResponse({
    description: 'Create transaction',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post()
  async createTransaction(
    @CurrentUser() user: Session,
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(user.id, createTransactionDto);
  }

  @ApiOkResponse({
    description: 'Get transaction by Id',
    type: TransactionResponseDto,
  })
  @Get(':id')
  async getTransactionById(
    @CurrentUser() user: Session,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.getById(user.id, user.roles, id);
  }

  @ApiOkResponse({
    description: 'Update transaction',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Put(':id')
  async updateTransaction(
    @CurrentUser() user: Session,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.updateById(
      id,
      user.id,
      updateTransactionDto,
    );
  }

  @ApiNoContentResponse({
    description: 'Delete transaction',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @CurrentUser() user: Session,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.transactionService.deleteById(user.id, id);
  }
}
