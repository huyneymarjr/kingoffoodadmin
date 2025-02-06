import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateInventoryDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: 'name có định dạng là string' })
    name: string;

    @IsNotEmpty({ message: 'quantity không được để trống' })
    @IsNumber({}, { message: 'quantity có định dạng là number' })
    quantity: number;

    @IsNotEmpty({ message: 'unit không được để trống' })
    @IsString({ message: 'unit có định dạng là string' })
    unit: string;

    @IsNotEmpty({ message: 'price không được để trống' })
    @IsNumber({}, { message: 'price có định dạng là number' })
    price: number;
}