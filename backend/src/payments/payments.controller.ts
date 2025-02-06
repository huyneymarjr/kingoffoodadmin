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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @User() user: IUser) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Payments with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.paymentsService.findAll(+currentPage, +limit, qs);
  }
  @Get('dashboard-payments')
  @Public()
  @ResponseMessage('dashboardPayment')
  dashboardPayment(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query() qs: string,
  ) {
    return this.paymentsService.dashboardPayment(month, year, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @User() user: IUser,
  ) {
    return this.paymentsService.update(id, updatePaymentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.paymentsService.remove(id, user);
  }
}
