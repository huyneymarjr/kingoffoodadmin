import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu, MenuDocument } from './schemas/menu.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: SoftDeleteModel<MenuDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  create(createMenuDto: CreateMenuDto, user: IUser) {
    return this.menuModel.create({
      ...createMenuDto,
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

    const totalItems = (await this.menuModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const categories = await this.categoryModel.find();

    let result = await this.menuModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    result.map((item) => {
      if (item.categoryId) {
        const category = categories.find(
          (category) => category._id.toString() === item.categoryId.toString(),
        );
        item.categoryName = category?.name;
      } else {
        item.categoryName = '';
      }
      return item;
    });
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
      throw new BadRequestException(`not found menu with id=${id}`);
    }

    return await this.menuModel.findById(id);
  }

  async update(id: string, updateMenuDto: UpdateMenuDto, user: IUser) {
    if (updateMenuDto.status === 'Hoạt động') {
      const menu = await this.menuModel.findById(id);
      if (menu.categoryId) {
        const category = await this.categoryModel.findById(menu.categoryId);
        if (category.status === 'Không hoạt động') {
          throw new BadRequestException(
            `Nhóm ăn ${category.name} đang không hoạt động`,
          );
        }
      }
    }
    return await this.menuModel.updateOne(
      { _id: id },
      {
        ...updateMenuDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.menuModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.menuModel.softDelete({
      _id: id,
    });
  }
}
