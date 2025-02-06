import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User() user: IUser,
  ) {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Transactions with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.transactionsService.findAll(+currentPage, +limit, qs);
  }

  @Get('dashboard-transactions')
  @ResponseMessage('Fetch data with transactions')
  dashboardTransactions(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query() qs: string,
  ) {
    return this.transactionsService.dashboardTransactions(month, year, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @User() user: IUser,
  ) {
    return this.transactionsService.update(id, updateTransactionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.transactionsService.remove(id, user);
  }
}
