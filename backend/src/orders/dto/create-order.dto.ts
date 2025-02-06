import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'userId không được để trống' })
  @Type(() => mongoose.Schema.Types.ObjectId)
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'tableId không được để trống' })
  @Type(() => mongoose.Schema.Types.ObjectId)
  tableId: mongoose.Schema.Types.ObjectId;

  // @IsNotEmpty({ message: 'customerId không được để trống' })
  @IsOptional()
  @Type(() => mongoose.Schema.Types.ObjectId)
  customerId: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @Type(() => mongoose.Schema.Types.ObjectId)
  promotionId: mongoose.Schema.Types.ObjectId;

  // @IsNotEmpty({ message: 'paymentId không được để trống' })
  @IsOptional()
  @Type(() => mongoose.Schema.Types.ObjectId)
  paymentId: mongoose.Schema.Types.ObjectId;

  // @IsNotEmpty({ message: 'orderdetails không được để trống', })
  @IsOptional()
  @IsMongoId({ each: true, message: 'each orderdetail là mongo object id' })
  @IsArray({ message: 'orderdetails có định dạng là array' })
  orderdetails: mongoose.Schema.Types.ObjectId[];

  @IsNotEmpty({ message: 'status không được để trống' })
  @IsString({ message: 'status có định dạng là string' })
  status: string;

  @IsOptional()
  @IsNumber({}, { message: 'point có định dạng là string' })
  point: string;

  @IsOptional()
  @IsString({ message: 'note có định dạng là string' })
  note: string;

  // @IsNotEmpty({ message: 'totalPrice không được để trống' })
  @IsOptional()
  @IsNumber({}, { message: 'totalPrice có định dạng là number' })
  totalPrice: number;
}
