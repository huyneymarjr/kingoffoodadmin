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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @User() user: IUser) {
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Customer with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
    @Query('type') type: string,
  ) {
    return this.customersService.findAll(+currentPage, +limit, qs, type);
  }
  @Get('dashboard-customers')
  @Public()
  @ResponseMessage('dashboardCustomer')
  dashboardCustomer(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query() qs: string,
  ) {
    return this.customersService.dashboardCustomer(month, year, qs);
  }

  @Get('list-customer-supplier')
  @Public()
  getListCustomerSupplier() {
    return this.customersService.getListCustomerSupplier();
  }
  @Get('list-customer-customer')
  @Public()
  getListCustomer() {
    return this.customersService.getListCustomer();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @User() user: IUser,
  ) {
    return this.customersService.update(id, updateCustomerDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.customersService.remove(id, user);
  }
}
