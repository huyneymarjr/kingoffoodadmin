import { PartialType } from '@nestjs/swagger';
import { CreateTableDto } from './create-table.dto';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTableDto extends PartialType(CreateTableDto) {}

export class AssignCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'tableId không được để trống' })
  tableId: string;

  @IsString()
  @IsNotEmpty({ message: 'bookerId không được để trống' })
  bookerId: string;

  @IsOptional()
  @IsString()
  nameCustomer: string;

  @IsOptional()
  @IsString()
  emailCustomer: string;

  @IsOptional()
  @IsString()
  phoneNumberCustomer: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value);
    const utcDate = new Date(date.getTime() + 3.5 * 60 * 60 * 1000);
    return utcDate;
  })
  time: Date;

  @IsString()
  @IsNotEmpty({ message: 'customerId không được để trống' })
  type: 'Đặt bàn' | 'Hủy bàn';
}

export class ChangeTableDto {
  @IsString()
  @IsNotEmpty({ message: 'tableId không được để trống' })
  tableId: string;

  @IsString()
  @IsNotEmpty({ message: 'bookerId không được để trống' })
  newTableId: string;

  @IsString()
  @IsNotEmpty({ message: 'orderId không được để trống' })
  orderId: string;
}
