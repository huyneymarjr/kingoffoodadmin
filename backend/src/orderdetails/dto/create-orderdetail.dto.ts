import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsMongoId,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateOrderdetailDto {
  @IsNotEmpty({ message: 'menuId không được để trống' })
  @IsMongoId({ message: 'menuId phải là một MongoId hợp lệ' })
  menuId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'orderId không được để trống' })
  @IsMongoId({ message: 'orderId phải là một MongoId hợp lệ' })
  orderId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'quantity không được để trống' })
  @IsNumber({}, { message: 'quantity có định dạng là number' })
  quantity: number;

  @IsNotEmpty({ message: 'price không được để trống' })
  @IsNumber({}, { message: 'price có định dạng là number' })
  price: number;

  @IsOptional()
  @IsString({ message: 'note có định dạng là number' })
  note: string;
}
