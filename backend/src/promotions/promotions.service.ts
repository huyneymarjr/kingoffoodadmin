import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: SoftDeleteModel<PromotionDocument>,
  ) {}

  create(createPromotionDto: CreatePromotionDto, user: IUser) {
    return this.promotionModel.create({
      ...createPromotionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.promotionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.promotionModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found promotion with id=${id}`);
    }

    return await this.promotionModel.findById(id);
  }

  async update(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
    user: IUser,
  ) {
    return await this.promotionModel.updateOne(
      { _id: id },
      {
        ...updatePromotionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.promotionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.promotionModel.softDelete({
      _id: id,
    });
  }

  async checkPromotion(name: string) {
    return await this.promotionModel
      .findOne({ name: new RegExp(`^${name}$`, 'i') }) //Sử dụng biểu thức chính quy với tùy chọn i để tìm kiếm không phân biệt chữ hoa chữ thường
      .exec();
  }
}
