import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from 'src/customers/schemas/customer.schema';
import { Table, TableDocument } from 'src/tables/schemas/table.schema';
import { Area, AreaDocument } from 'src/areas/schemas/area.schema';
import {
  Orderdetail,
  OrderdetailDocument,
} from 'src/orderdetails/schemas/orderdetail.schema';
import { Menu, MenuDocument } from 'src/menus/schemas/menu.schema';
import { Payment, PaymentDocument } from 'src/payments/schemas/payment.schema';

import { User, UserDocument } from 'src/users/schemas/user.schema';
import {
  Promotion,
  PromotionDocument,
} from 'src/promotions/schemas/promotion.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Customer.name)
    private customerModule: Model<CustomerDocument>,
    @InjectModel(Table.name)
    private tablesModule: Model<TableDocument>,
    @InjectModel(Area.name)
    private areasModule: Model<AreaDocument>,
    @InjectModel(Orderdetail.name)
    private orderdetailModel: Model<OrderdetailDocument>,
    @InjectModel(Menu.name)
    private menuModel: Model<MenuDocument>,
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name)
    private usersModel: Model<UserDocument>,
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,
  ) {}

  create(createOrderDto: CreateOrderDto, user: IUser) {
    return this.orderModel.create({
      ...createOrderDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    let result = await this.orderModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    result = await Promise.all(
      result.map(async (order) => {
        const customer = await this.customerModule
          .findById(order.customerId)
          .select('name')
          .exec();
        return {
          ...order.toJSON(),
          nameCustomer: customer ? customer.name : null,
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
      result,
    };
  }

  async findAllCustomer(
    currentPage: number,
    limit: number,
    type: string,
    qs: string,
  ) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    delete filter.type;
    console.log(filter);
    const keysToCheck = [
      'customerId',
      'userId',
      'status',
      '_id',
      'endDate',
      'startDate',
    ];

    keysToCheck.forEach((key) => {
      if (filter[key] == null || filter[key] === 'undefined') {
        delete filter[key];
      }
    });

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    let filterCondition = { ...filter };
    let populateOptions: any = population;
    let result;
    if (filter._id) {
      const convertToString = (await this.orderModel.find()).map((order) =>
        order._id.toString(),
      );
      const getId = convertToString.filter((id) => id.includes(filter._id));
      filterCondition._id = {
        $in: getId.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    if (filter.startDate && filter.endDate) {
      delete filterCondition.startDate;
      delete filterCondition.endDate;

      const startDate = new Date(
        new Date(filter.startDate).setUTCHours(0, 0, 0, 0),
      );
      const endDate = new Date(
        new Date(filter.endDate).setUTCHours(23, 59, 59, 999),
      );

      filterCondition.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (type == '1') {
      filterCondition.paymentId = { $exists: true };
      populateOptions = {
        path: 'paymentId',
        match: { status: 'Đã thanh toán' },
      };
    } else if (type == '2') {
      filterCondition.paymentId = { $exists: true };
      populateOptions = {
        path: 'paymentId',
        match: { status: 'Chưa thanh toán' },
      };
    } else if (type == '3') {
      filterCondition.status = 'Đã xác nhận';
    } else if (type == '4') {
      filterCondition.status = 'Đặt trước';
    } else if (type == '0') {
      populateOptions = {
        path: 'paymentId',
      };
    }
    const totalItems = (await this.orderModel.find(filterCondition)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    result = await this.orderModel
      .find(filterCondition)
      .skip(offset)
      .limit(defaultLimit)
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate(populateOptions)
      .exec();
    result = await Promise.all(
      result.map(async (order) => {
        const customer = await this.customerModule
          .findById(order.customerId)
          .select('name')
          .exec();
        const user = await this.usersModel
          .findById(order.userId)
          .select('name')
          .exec();

        return {
          ...order.toJSON(),
          nameCustomer: customer ? customer.name : null,
          nameBooker: user ? user.name : null,
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
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found order with id=${id}`);
    }
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new BadRequestException(`not found order with id=${id}`);
    }
    if (order) {
      const customer = await this.customerModule.findById(order.customerId);
      const table = await this.tablesModule.findById(order.tableId);
      const orderDetails: any = await this.orderdetailModel
        .find({
          _id: { $in: order.orderdetails },
        })
        .populate('menuId', 'name unit')
        .exec();
      const promotion = order.promotionId
        ? await this.promotionModel
            .findById(order.promotionId)
            .select('name discount')
            .exec()
        : null;
      const payment = order?.paymentId
        ? await this.paymentModel.findById(order?.paymentId)
        : {};

      return {
        order: {
          ...order.toJSON(),
          orderdetails: orderDetails.map((orderDetail) => ({
            ...orderDetail.toObject(),
            menuId: orderDetail.menuId._id,
            name: orderDetail.menuId.name,
            unit: orderDetail.menuId.unit,
          })),
          promotion: promotion ? promotion : { name: null, discount: null },
        },
        payment,
        customer,
        table: {
          ...table.toJSON(),
          areaNumber: await this.areasModule
            .findById(table.areaId)
            .select('areaNumber')
            .exec(),
        },
      };
    }
    return await this.orderModel.findById(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    return await this.orderModel.updateOne(
      { _id: id },
      {
        ...updateOrderDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.orderModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.orderModel.softDelete({
      _id: id,
    });
  }
}
