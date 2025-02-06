import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { Orderdetail, OrderdetailDocument } from './schemas/orderdetail.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';
import { Menu, MenuDocument } from 'src/menus/schemas/menu.schema';
import { name } from 'ejs';
import { Payment, PaymentDocument } from 'src/payments/schemas/payment.schema';

@Injectable()
export class OrderdetailsService {
  constructor(
    @InjectModel(Orderdetail.name)
    private orderdetailModel: SoftDeleteModel<OrderdetailDocument>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(Menu.name)
    private menuModel: Model<MenuDocument>,
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createOrderdetailDto: CreateOrderdetailDto, user: IUser) {
    const newOrderdetail = await this.orderdetailModel.create({
      ...createOrderdetailDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    const order = await this.orderModel.findOne({
      _id: createOrderdetailDto.orderId,
    });
    if (!order.paymentId) {
      const newPayment = new this.paymentModel({
        status: 'Chưa thanh toán',
        totalAmount: newOrderdetail?.price || 0,
      });
      await newPayment.save();

      await this.orderModel.updateOne(
        { _id: createOrderdetailDto.orderId },
        { $set: { paymentId: newPayment._id } },
      );
    } else {
      await this.orderModel.updateOne(
        { _id: createOrderdetailDto.orderId },
        { $push: { orderdetails: newOrderdetail._id } },
        { upsert: true },
      );
      await this.paymentModel.updateOne(
        { _id: order.paymentId },
        { $inc: { totalAmount: newOrderdetail.price } },
      );
    }

    return {
      ...newOrderdetail.toJSON(),
      // không cần thiết
      name: (await this.menuModel.findById(newOrderdetail.menuId)).name,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.orderdetailModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.orderdetailModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
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
      throw new BadRequestException(`not found order detail with id=${id}`);
    }

    return await this.orderdetailModel.findById(id);
  }

  async update(
    id: string,
    updateOrderdetailDto: UpdateOrderdetailDto,
    user: IUser,
  ) {
    const updatedOrderdetail = await this.orderdetailModel.updateOne(
      { _id: id },
      {
        ...updateOrderdetailDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    const orderId = await this.orderdetailModel
      .findOne({
        _id: id,
      })
      .select('orderId')
      .exec();
    console.log(orderId);
    const order = await this.orderModel
      .findOne({
        _id: orderId.orderId,
      })
      .exec();
    console.log(order);
    let totalAmount = 0;

    for (const orderdetailId of order.orderdetails) {
      const orderdetailUpdate = await this.orderdetailModel.findById(
        orderdetailId,
      );
      totalAmount += orderdetailUpdate.price * orderdetailUpdate.quantity;
    }

    await this.paymentModel.updateOne(
      { _id: order.paymentId },
      { $set: { totalAmount: totalAmount } },
    );

    return updatedOrderdetail;
  }

  async remove(id: string, user: IUser) {
    await this.orderdetailModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    await this.orderModel.updateOne(
      { orderdetails: id },
      {
        $pull: { orderdetails: id },
      },
      { multi: true },
    );
    return this.orderdetailModel.softDelete({
      _id: id,
    });
  }
}
