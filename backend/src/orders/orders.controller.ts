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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get('customer')
  @ApiOperation({ summary: 'Dùng ở trang hóa đơn' })
  @ApiQuery({
    name: 'type',
    description:
      'type = 0 Lấy tất cả hóa đơn ,type = 1 lấy hóa đơn đã thanh toán , type = 2: Lấy hóa đơn chưa thanh toán,type = 3: Đã xác nhận, type =4:Đặt trước',
  })
  @Public()
  @ResponseMessage('Fetch List Orders with paginate')
  findAllCustomer(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('type') type: string,
    @Query() qs: string,
  ) {
    return this.ordersService.findAllCustomer(+currentPage, +limit, type, qs);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Orders with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.ordersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ordersService.remove(id, user);
  }
}
