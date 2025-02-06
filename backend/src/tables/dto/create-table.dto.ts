import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateTableDto {
  @IsNotEmpty({ message: 'AreaId không được để trống' })
  @Type(() => mongoose.Schema.Types.ObjectId)
  areaId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'tableNumber không được để trống' })
  @IsNumber({}, { message: 'tableNumber có định dạng là number' })
  tableNumber: number;

  @IsNotEmpty({ message: 'status không được để trống' })
  @IsString({ message: 'status có định dạng là string' })
  status: string;

  @IsNotEmpty({ message: 'capacity không được để trống' })
  @IsNumber({}, { message: 'capacity có định dạng là number' })
  capacity: number;

  @IsOptional()
  ownerTable: {
    _id: mongoose.Schema.Types.ObjectId;
    nameCustomer?: string;
    emailCustomer?: string;
    phoneNumberCustomer?: string;
    orderId: mongoose.Schema.Types.ObjectId;
    time: Date;
  };
}
