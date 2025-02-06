import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table, TableDocument } from './schemas/table.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from 'src/customers/schemas/customer.schema';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';
import { Payment } from 'src/payments/schemas/payment.schema';

@Injectable()
export class TablesService {
  private readonly logger = new Logger(TablesService.name);
  @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>;
  @InjectModel(Order.name) private orderModel: Model<OrderDocument>;
  @InjectModel(Payment.name) private paymentModel: Model<Payment>;
  constructor(
    @InjectModel(Table.name)
    private tableModel: SoftDeleteModel<TableDocument>,
  ) {
    setInterval(() => this.scanAndCancelExpiredTables(), 60 * 60 * 1000);
  }
  async scanAndCancelExpiredTables() {
    const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const tables = await this.tableModel.find({
      'ownerTable.time': { $lt: oneHourAgo },
      status: 'Đặt trước',
    });

    for (const table of tables) {
      const ownerTableTime = new Date(table.ownerTable.time);
      const isPastDate =
        ownerTableTime < new Date(ownerTableTime.toDateString());
      const isExpiredToday = ownerTableTime < oneHourAgo;

      if (isPastDate || isExpiredToday) {
        await this.tableModel.findByIdAndUpdate(table._id, {
          $set: {
            ownerTable: null,
            status: 'Trống',
            updatedBy: {
              _id: '670d041a7dc74ce0ab853116',
              email: 'admin@gmail.com',
            },
          },
        });
        await this.orderModel.findOneAndUpdate(
          {
            tableId: table._id,
            userId: table.ownerTable._id,
            status: 'Đặt trước',
          },
          {
            $set: {
              status: 'Hủy',
            },
          },
        );
        this.logger.log(`Table ${table._id} has been reset due to inactivity.`);
      }
    }
  }

  create(createTableDto: CreateTableDto, user: IUser) {
    return this.tableModel.create({
      ...createTableDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(
    currentPage: number,
    limit: number,
    areaId: string,
    qs: string,
  ) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    if (areaId) {
      filter.areaId = areaId;
    }

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.tableModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.tableModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    const resultNeed = await Promise.all(
      result.map(async (table) => {
        if (!table.ownerTable) {
          return table;
        }
        const customerId = await (
          await this.orderModel.findById(table?.ownerTable?.orderId)
        )?.customerId;
        return {
          ...table.toObject(),
          ownerTable: table.ownerTable
            ? {
                ...table.ownerTable,
                _id: table.ownerTable._id,
                nameCustomer: (await this.customerModel.findById(customerId))
                  ?.name,
                emailCustomer: (await this.customerModel.findById(customerId))
                  ?.email,
                phoneNumberCustomer: (
                  await this.customerModel.findById(customerId)
                )?.phoneNumber,
                statusOrder: (
                  await this.orderModel.findById(table.ownerTable.orderId)
                )?.status,
                time: table.ownerTable.time,
              }
            : null,
        };
      }),
    );

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      // result,
      result: resultNeed,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found table with id=${id}`);
    }

    return await this.tableModel.findById(id);
  }

  async update(id: string, updateTableDto: UpdateTableDto, user: IUser) {
    return await this.tableModel.updateOne(
      { _id: id },
      {
        ...updateTableDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.tableModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.tableModel.softDelete({
      _id: id,
    });
  }
  async assignCustomer(assignCustomerDto: any, user: IUser) {
    const table = await this.tableModel.findById(assignCustomerDto.tableId);
    if (!table) {
      throw new BadRequestException(
        `Không tìm thấy bàn với id=${assignCustomerDto.tableId}`,
      );
    }
    // hủy bàn => status: trống + trạng thái hóa đơn là hủy
    if (assignCustomerDto.type === 'Hủy bàn') {
      const updatedTable = await this.tableModel.findOneAndUpdate(
        {
          _id: assignCustomerDto.tableId,
          'ownerTable._id': assignCustomerDto.bookerId,
        },
        {
          $set: {
            ownerTable: null,
            status: 'Trống',
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
        { new: true },
      );
      await this.orderModel.findOneAndUpdate(
        {
          tableId: assignCustomerDto.tableId,
          userId: assignCustomerDto.bookerId,
          status: 'Đặt trước',
        },
        {
          $set: {
            status: 'Hủy',
          },
        },
      );
      return updatedTable;
    }
    // đã có khách => status: đã có khách + trạng thái hóa đơn là đã xác nhận + tạo thêm 1 payment
    else if (assignCustomerDto.type === 'Đã có khách') {
      const updatedTable = await this.tableModel.findOneAndUpdate(
        {
          _id: assignCustomerDto.tableId,
          'ownerTable._id': assignCustomerDto.bookerId,
        },
        {
          $set: {
            status: 'Đã có khách',
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      );
      const createPayment = await this.paymentModel.create({
        status: 'Chưa thanh toán',
      });
      await this.orderModel.findOneAndUpdate(
        {
          tableId: assignCustomerDto.tableId,
          userId: assignCustomerDto.bookerId,
          status: 'Đặt trước',
        },
        {
          $set: {
            status: 'Đã xác nhận',
            paymentId: createPayment._id,
          },
        },
      );

      return updatedTable;
    }
    if (table.status === 'Đã có khách' || table.status === 'Đặt trước') {
      throw new BadRequestException(`Bàn đang được sử dụng`);
    } else {
      // update customer
      const conditions = [];
      if (assignCustomerDto.phoneNumberCustomer) {
        conditions.push({ phoneNumber: assignCustomerDto.phoneNumberCustomer });
      }

      if (assignCustomerDto.emailCustomer) {
        conditions.push({ email: assignCustomerDto.emailCustomer });
      }
      const existingCustomer = await this.customerModel.findOne(
        conditions.length > 0 ? { $or: conditions } : {},
      );
      const updateData = {
        name: assignCustomerDto.nameCustomer,
        phoneNumber: assignCustomerDto.phoneNumberCustomer,
        email: assignCustomerDto.emailCustomer,
        type: 'Khách hàng',
        userId: assignCustomerDto.bookerId,
        address: '',
      };

      if (!existingCustomer) {
        updateData['point'] = 0;
      }
      // nếu đặt bàn trước mà chưa có khách hàng thì tạo mới khách hàng nếu đã có thì update
      const customer = await this.customerModel.findOneAndUpdate(
        conditions.length > 0 ? { $or: conditions } : {},
        {
          $set: updateData,
        },
        {
          new: true,
          upsert: true,
        },
      );
      // nếu đặt bàn trước thì tạo hóa đơn
      // update order
      const order = await this.orderModel.create({
        userId: assignCustomerDto.bookerId,
        tableId: assignCustomerDto.tableId,
        customerId: customer._id,
        status: 'Đặt trước',
      });
      // cập nhật trạng thái của bàn => đặt trước
      // update table
      const updatedTable = await this.tableModel.findOneAndUpdate(
        { _id: assignCustomerDto.tableId },
        {
          $set: {
            ownerTable: {
              _id: assignCustomerDto.bookerId,
              orderId: order._id,
              time: assignCustomerDto.time,
            },
            status: 'Đặt trước',
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
        { new: true },
      );

      return {
        table: {
          ...updatedTable.toObject(),
          ownerTable: {
            _id: assignCustomerDto.bookerId,
            nameCustomer: assignCustomerDto.nameCustomer,
            emailCustomer: assignCustomerDto.emailCustomer,
            phoneNumberCustomer: assignCustomerDto.phoneNumberCustomer,
            orderId: order._id,
            time: assignCustomerDto.time,
          },
        },
        customer,
        order,
      };
    }
  }

  async changeTable(changeTableDto: any, user: IUser) {
    const table = await this.tableModel.findById(changeTableDto.tableId);
    const newTable = await this.tableModel.findById(changeTableDto.newTableId);
    if (!table || !newTable) {
      throw new BadRequestException(`Không tìm thấy bàn với `);
    }
    //bulkWrite thực hiện nhiều thao tác cùng lúc
    await this.tableModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: changeTableDto.newTableId },
          update: {
            $set: {
              ownerTable: table.ownerTable,
              status: table.status,
              updatedBy: {
                _id: user._id,
                email: user.email,
              },
            },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: changeTableDto.tableId },
          update: {
            $set: {
              ownerTable: null,
              status: 'Trống',
              updatedBy: {
                _id: user._id,
                email: user.email,
              },
            },
          },
        },
      },
    ]);
    await this.orderModel.findOneAndUpdate(
      {
        _id: changeTableDto.orderId,
      },
      {
        $set: {
          tableId: changeTableDto.newTableId,
        },
      },
      {
        upsert: true,
      },
    );
    return {
      message: 'Chuyển bàn thành công',
    };
  }
}
