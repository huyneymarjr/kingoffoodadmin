import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateMenuDto {
  @IsNotEmpty({ message: 'categoryId không được để trống' })
  @IsMongoId({ message: 'categoryId phải là một MongoId hợp lệ' })
  categoryId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'name không được để trống' })
  @IsString({ message: 'name có định dạng là string' })
  name: string;

  @IsNotEmpty({ message: 'price không được để trống' })
  @IsNumber({}, { message: 'price có định dạng là number' })
  price: number;

  @IsOptional()
  @IsString({ message: 'description có định dạng là string' })
  description: string;

  @IsNotEmpty({ message: 'status không được để trống' })
  @IsString({ message: 'status có định dạng là string' })
  status: string;

  @IsOptional()
  @IsString({ message: 'unit có định dạng là string' })
  unit: string;

  @IsOptional()
  @IsString({ message: 'image có định dạng là string' })
  image: string;
}
