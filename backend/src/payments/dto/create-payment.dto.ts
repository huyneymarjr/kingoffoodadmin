import {
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDate,
  IsMongoId,
  ValidateNested,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @IsArray({ message: 'method phải là một mảng' })
  @ArrayNotEmpty({ message: 'method không được để trống' })
  @IsString({
    each: true,
    message: 'Mỗi phần tử trong method phải có định dạng là string',
  })
  method: string[];

  @IsNotEmpty({ message: 'paymentMethod không được để trống' })
  paymentMethod: object;

  @IsNotEmpty({ message: 'paymentTime không được để trống' })
  @IsDate({ message: 'paymentTime phải là một ngày hợp lệ' })
  @Type(() => Date)
  paymentTime: Date;

  @IsNotEmpty({ message: 'totalAmount không được để trống' })
  @IsNumber({}, { message: 'totalAmount có định dạng là number' })
  totalAmount: number;

  @IsNotEmpty({ message: 'status không được để trống' })
  @IsString({ message: 'status có định dạng là string' })
  status: string;
}
