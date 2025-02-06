import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Area } from 'src/areas/schemas/area.schema';
import { Customer } from 'src/customers/schemas/customer.schema';

export type TableDocument = HydratedDocument<Table>;

@Schema({ timestamps: true })
export class Table {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Area.name })
  areaId: mongoose.Schema.Types.ObjectId;

  @Prop()
  tableNumber: number;

  @Prop()
  status: string;

  @Prop({ type: Object })
  ownerTable?: {
    _id: mongoose.Schema.Types.ObjectId;
    nameCustomer?: string;
    emailCustomer?: string;
    phoneNumberCustomer?: string;
    orderId: mongoose.Schema.Types.ObjectId;
    time: Date;
  };

  @Prop()
  capacity: number;

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

export const TableSchema = SchemaFactory.createForClass(Table);
