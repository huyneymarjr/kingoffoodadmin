import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Menu } from 'src/menus/schemas/menu.schema';
import { Order } from 'src/orders/schemas/order.schema';

export type OrderdetailDocument = HydratedDocument<Orderdetail>;

@Schema({ timestamps: true })
export class Orderdetail {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Menu.name })
  menuId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orderId: mongoose.Schema.Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  note: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const OrderdetailSchema = SchemaFactory.createForClass(Orderdetail);
