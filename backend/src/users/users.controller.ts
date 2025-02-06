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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { IUser } from './users.interface';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create a new User')
  async create(@Body() huydev: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(huydev, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  @Get('get-list-user')
  @Public()
  @ResponseMessage('Fetch user with no paginate')
  getListUser() {
    return this.usersService.getListUser();
  }

  @Get()
  @ResponseMessage('Fetch user with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('isDeleted') isDeleted: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs, isDeleted);
  }

  @Get('dashboard-user')
  @ResponseMessage('Fetch user with dashboardUser')
  dashboardUser(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query() qs: string,
  ) {
    return this.usersService.dashboardUser(month, year, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @ResponseMessage('Update a User')
  @Patch(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
    @Param('id') id: string,
  ) {
    let updatedUser = await this.usersService.update(updateUserDto, user, id);
    return updatedUser;
  }

  @Patch(':id/restore')
  @ResponseMessage('Restore a deleted User')
  async restore(@Param('id') id: string, @User() user: IUser) {
    const restoredUser = await this.usersService.restore(id, user);
    return {
      _id: restoredUser?._id,
      restoredAt: new Date(),
    };
  }

  @Delete(':id')
  @ResponseMessage('Delete a User')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }

  @Post('change-password')
  @SkipCheckPermission()
  @ResponseMessage('Change user password')
  async changePassword(
    @User() user: IUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user, changePasswordDto);
  }
}
