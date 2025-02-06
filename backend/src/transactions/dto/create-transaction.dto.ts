import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'inventoryID không được để trống' })
  @Type(() => mongoose.Schema.Types.ObjectId)
  inventoryId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'type không được để trống' })
  @IsString({ message: 'type có định dạng là string' })
  type: string;

  @IsNotEmpty({ message: 'quantity không được để trống' })
  @IsNumber({}, { message: 'quantity có định dạng là number' })
  quantity: number;

  @ValidateIf((o) => o.type === 'Nhập')
  @IsNotEmpty({ message: 'customerId không được để trống' })
  @Type(() => mongoose.Schema.Types.ObjectId)
  customerId: mongoose.Schema.Types.ObjectId;
}
