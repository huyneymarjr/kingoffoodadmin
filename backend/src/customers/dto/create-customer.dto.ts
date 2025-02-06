import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';

export enum CustomerType {
  SUPPLIER = 'Nhà cung cấp',
  CUSTOMER = 'Khách hàng',
}

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'inventoryID không được để trống' })
  @Type(() => mongoose.Schema.Types.ObjectId)
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'name không được để trống' })
  @IsString({ message: 'name có định dạng là string' })
  name: string;

  // @IsNotEmpty({ message: 'email không được để trống' })
  // @IsEmail({}, { message: 'email có định dạng là email' })
  @IsOptional()
  @IsEmail({}, { message: 'email có định dạng là email' })
  email: string;

  // @IsNotEmpty({ message: 'phoneNumber không được để trống' })
  // @IsString({ message: 'phoneNumber có định dạng là string' })
  @IsOptional()
  @IsString({ message: 'phoneNumber có định dạng là string' })
  phoneNumber: string;

  @ValidateIf((o) => o.type !== CustomerType.SUPPLIER)
  @IsNotEmpty({ message: 'point không được để trống' })
  @IsNumber({}, { message: 'point có định dạng là number' })
  point: number;

  @IsNotEmpty({ message: 'Type không được để trống' })
  @IsEnum(CustomerType, {
    message: 'type chỉ nhận giá trị là "Nhà cung cấp" hoặc "Khách hàng"',
  })
  type: CustomerType;

  @IsNotEmpty({ message: 'address không được để trống' })
  @IsString({ message: 'address có định dạng là string' })
  address: string;

  @ValidateIf((o) => o.type !== CustomerType.SUPPLIER)
  @IsNotEmpty({ message: 'gender không được để trống' })
  @IsString({ message: 'gender có định dạng là string' })
  gender: string;

  @IsString({ message: 'note có định dạng là string' })
  note: string;
}
