import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString,} from 'class-validator';

export class CreatePromotionDto {
    @IsNotEmpty({ message: 'name không được để trống' })
    @IsString({ message: 'name có định dạng là string' })
    name: string;

    @IsNotEmpty({ message: 'discount không được để trống' })
    @IsNumber({}, { message: 'discount có định dạng là number' })
    discount: number;

    @IsNotEmpty({ message: 'startDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'startDate có định dạng là Date' })
    startDate: Date;

    @IsNotEmpty({ message: 'endDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'endDate có định dạng là Date' })
    endDate: Date;

    @IsNotEmpty({ message: 'status không được để trống' })
    @IsString({ message: 'status có định dạng là string' })
    status: string;
}