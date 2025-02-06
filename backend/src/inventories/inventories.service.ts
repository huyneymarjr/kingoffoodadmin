import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class InventoriesService {

  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: SoftDeleteModel<InventoryDocument>
  ) { }

  create(createInventoryDto: CreateInventoryDto, user: IUser) {
    return this.inventoryModel.create({
      ...createInventoryDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.inventoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.inventoryModel.find(filter)
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
        total: totalItems
      },
      result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found inventory with id=${id}`);
    }

    return await this.inventoryModel.findById(id);
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto, user: IUser) {
    return await this.inventoryModel.updateOne(
      { _id: id },
      {
        ...updateInventoryDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.inventoryModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return this.inventoryModel.softDelete({
      _id: id
    });
  }

  async updateQuantity(inventoryId: string, quantity: number): Promise<Inventory> {
    const inventory = await this.inventoryModel.findById(inventoryId);
    if (!inventory) {
      throw new Error('Không tìm thấy hàng tồn kho');
    }

    inventory.quantity += quantity;
    return inventory.save();
  }
}
