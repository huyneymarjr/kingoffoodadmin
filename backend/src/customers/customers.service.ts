import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import { TablesModule } from 'src/tables/tables.module';
import { Table, TableDocument } from 'src/tables/schemas/table.schema';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: SoftDeleteModel<CustomerDocument>,
    @InjectModel(Table.name)
    private tableModel: Model<TableDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}
  async checkExistCustomer(
    createCustomerDto: CreateCustomerDto | UpdateCustomerDto,
  ) {
    if (
      createCustomerDto.email !== undefined &&
      (await this.customerModel
        .findOne({ email: createCustomerDto.email })
        .where({ isDeleted: false }))
    ) {
      throw new BadRequestException(
        `Email ${createCustomerDto.email} này đã tồn tại`,
      );
    }
    if (
      createCustomerDto.phoneNumber !== undefined &&
      (await this.customerModel
        .findOne({
          phoneNumber: createCustomerDto.phoneNumber,
        })
        .where({ isDeleted: false }))
    ) {
      throw new BadRequestException(
        `Số điện thoại ${createCustomerDto.phoneNumber} này đã tồn tại`,
      );
    }
    return true;
  }
  async create(createCustomerDto: CreateCustomerDto, user: IUser) {
    await this.checkExistCustomer(createCustomerDto);
    return this.customerModel.create({
      ...createCustomerDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string, type: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    if (type) {
      filter.type = type;
    }

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.customerModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.customerModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort({ updatedAt: -1, createdAt: -1 })
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found customer with id=${id}`);
    }

    return await this.customerModel.findById(id);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, user: IUser) {
    if (
      updateCustomerDto.email !== undefined &&
      (await this.customerModel
        .findOne({ email: updateCustomerDto.email, isDeleted: false })
        .where('_id')
        .ne(id))
    ) {
      throw new BadRequestException(
        `Email ${updateCustomerDto.email} này đã tồn tại`,
      );
    }
    if (
      updateCustomerDto.phoneNumber !== undefined &&
      (await this.customerModel
        .findOne({
          phoneNumber: updateCustomerDto.phoneNumber,
          isDeleted: false,
        })
        .where('_id')
        .ne(id))
    ) {
      throw new BadRequestException(
        `Số điện thoại ${updateCustomerDto.phoneNumber} này đã tồn tại`,
      );
    }

    return await this.customerModel.updateOne(
      { _id: id },
      {
        ...updateCustomerDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    const table = await this.tableModel.find({
      ownerTable: { $ne: null },
    });
    const checkOrder = await this.orderModel.find({
      _id: { $in: table.map((item) => item.ownerTable.orderId) },
      customerId: id,
    });
    if (checkOrder.length > 0) {
      throw new BadRequestException(
        'Khách hàng này đang đặt bàn, không thể xóa',
      );
    }

    await this.customerModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.customerModel.softDelete({
      _id: id,
    });
  }
  async getListCustomerSupplier() {
    return await this.customerModel.find({ type: 'Nhà cung cấp' });
  }
  async getListCustomer() {
    // chưa lấy được những khách hàng có isDeleted = true
    const customers = await this.customerModel.find({
      type: 'Khách hàng',
      isDeleted: { $in: [true, false] },
    });
    return customers;
  }
  async dashboardCustomer(month: number, year: number, qs: string) {
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const result = await this.customerModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            type: '$type',
          },
          totalCreated: { $sum: 1 },
        },
      },
    ]);

    return {
      result,
    };
  }
}
