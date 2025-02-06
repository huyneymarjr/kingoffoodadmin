import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsObject, IsOptional } from 'class-validator';

export class CreateAreaDto {
    @IsNotEmpty({ message: 'areaNumber không được để trống' })
    @IsNumber({}, { message: 'areaNumber có định dạng là number' })
    areaNumber: number;

    @IsNotEmpty({ message: 'status không được để trống' })
    @IsString({ message: 'status có định dạng là string' })
    status: string;

    @IsNotEmpty({ message: 'capacity không được để trống' })
    @IsNumber({}, { message: 'capacity có định dạng là number' })
    capacity: number;
}