import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;
type PaymentMethod = 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ ghi nợ';
@Schema({ timestamps: true })
export class Payment {
  @Prop()
  method: string[];

  @Prop({
    type: Map,
    of: Number,
    default: { 'Tiền mặt': 0, 'Chuyển khoản': 0, 'Thẻ ghi nợ': 0 },
  })
  paymentMethod: Record<PaymentMethod, number>;

  @Prop()
  paymentTime: Date;

  @Prop()
  totalAmount: number;

  @Prop()
  status: string;

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

export const PaymentSchema = SchemaFactory.createForClass(Payment);
