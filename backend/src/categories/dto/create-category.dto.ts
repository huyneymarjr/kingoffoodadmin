import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, IsObject, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: 'name có định dạng là string' })
    name: string;

    @IsOptional()
    @IsString({ message: 'description có định dạng là string' })
    description?: string;

    @IsNotEmpty({ message: 'status không được để trống' })
    @IsString({ message: 'status có định dạng là string' })
    status: string;
}