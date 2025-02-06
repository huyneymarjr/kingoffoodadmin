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
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import {
  UpdateTableDto,
  AssignCustomerDto,
  ChangeTableDto,
} from './dto/update-table.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post('assign-customer')
  assignCustomer(
    @Body() assignCustomerDto: AssignCustomerDto,
    @User() user: IUser,
  ) {
    return this.tablesService.assignCustomer(assignCustomerDto, user);
  }

  @Post('change-table')
  changeTable(@Body() changeTableDto: ChangeTableDto, @User() user: IUser) {
    return this.tablesService.changeTable(changeTableDto, user);
  }

  @Post()
  create(@Body() createTableDto: CreateTableDto, @User() user: IUser) {
    return this.tablesService.create(createTableDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Table with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('areaId') areaId: string,
    @Query() qs: string,
  ) {
    return this.tablesService.findAll(+currentPage, +limit, areaId, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
    @User() user: IUser,
  ) {
    return this.tablesService.update(id, updateTableDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.tablesService.remove(id, user);
  }
}
