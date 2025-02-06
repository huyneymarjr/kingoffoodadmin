import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import { InventoriesService } from '../inventories/inventories.service';
import {
  Inventory,
  InventoryDocument,
} from 'src/inventories/schemas/inventory.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: SoftDeleteModel<TransactionDocument>,
    @InjectModel(Inventory.name)
    private inventoryModel: SoftDeleteModel<InventoryDocument>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: IUser) {
    const { inventoryId, type, quantity } = createTransactionDto;

    if (type !== 'Nhập' && type !== 'Xuất') {
      throw new BadRequestException(
        'Không hợp lệ. Phải là "Nhập" hoặc "Xuất".',
      );
    }
    // const inventoriesDetail = await this.inventoriesService.findOne(
    //   inventoryId.toString(),
    // );
    const inventoriesDetail = await this.inventoryModel.findById(inventoryId);
    if (type === 'Xuất' && quantity > inventoriesDetail.quantity) {
      throw new BadRequestException('Số lượng xuất lớn hơn số lượng tồn kho');
    }

    // Tính toán số lượng cần cập nhật
    const updateQuantity = type === 'Nhập' ? quantity : -quantity;

    // Cập nhật số lượng trong inventory
    // return this.inventoriesService
    //   .updateQuantity(inventoryId.toString(), updateQuantity)
    //   .then(() => {
    //     const newTransaction = new this.transactionModel({
    //       ...createTransactionDto,
    //       createdBy: {
    //         _id: user._id,
    //         email: user.email,
    //       },
    //     });

    //     return newTransaction.save();
    //   });
    await this.inventoryModel.updateOne(
      { _id: inventoryId },
      { $inc: { quantity: updateQuantity } },
    );
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.transactionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.transactionModel
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
      throw new BadRequestException(`Không tìm thấy giao dịch với id=${id}`);
    }

    return await this.transactionModel.findById(id);
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    user: IUser,
  ) {
    const transaction = await this.transactionModel.findById(id);
    if (!transaction) {
      throw new BadRequestException(`Không tìm thấy giao dịch với id=${id}`);
    }
    // const inventoriesDetail = await this.inventoriesService.findOne(
    //   updateTransactionDto.inventoryId.toString(),
    // );
    const inventoriesDetail = await this.inventoryModel.findById(
      updateTransactionDto.inventoryId,
    );
    if (
      updateTransactionDto.type === 'Xuất' &&
      updateTransactionDto.quantity > inventoriesDetail.quantity
    ) {
      throw new BadRequestException('Số lượng xuất lớn hơn số lượng tồn kho');
    }

    let quantityChange = 0;
    if (updateTransactionDto.type === 'Nhập') {
      quantityChange = updateTransactionDto.quantity;
    } else if (updateTransactionDto.type === 'Xuất') {
      quantityChange = -updateTransactionDto.quantity;
    }

    // await this.inventoriesService.updateQuantity(
    //   transaction.inventoryId.toString(),
    //   quantityChange,
    // );
    await this.inventoryModel.updateOne(
      { _id: transaction.inventoryId },
      { $inc: { quantity: quantityChange } },
    );

    return await this.transactionModel.updateOne(
      { _id: id },
      {
        ...updateTransactionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    const transaction = await this.transactionModel.findById(id);
    if (!transaction) {
      throw new BadRequestException(`Không tìm thấy giao dịch với id=${id}`);
    }

    let quantityChange = 0;
    if (transaction.type === 'Nhập') {
      quantityChange = -transaction.quantity;
    } else if (transaction.type === 'Xuất') {
      quantityChange = transaction.quantity;
    }

    // await this.inventoriesService.updateQuantity(
    //   transaction.inventoryId.toString(),
    //   quantityChange,
    // );
    await this.inventoryModel.updateOne(
      { _id: transaction.inventoryId },
      { $inc: { quantity: quantityChange } },
    );

    await this.transactionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.transactionModel.softDelete({
      _id: id,
    });
  }

  async dashboardTransactions(month: number, year: number, qs: any) {
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const result = await this.transactionModel.find().exec();
    console.log('result', result);
    const data = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$type',
          inventoryIds: { $push: '$inventoryId' },
        },
      },
    ]);

    const sumTypeImportIds = data.find(
      (item) => item._id === 'Nhập',
    )?.inventoryIds;

    const sumTypeExportIds = data.find(
      (item) => item._id === 'Xuất',
    )?.inventoryIds;
    let sumTypeImportMoney = 0;
    let sumTypeExportMoney = 0;
    if (!sumTypeImportIds || sumTypeImportIds?.length == 0) {
      sumTypeImportMoney = 0;
    } else {
      const sumTypeImportResult = await this.inventoryModel.aggregate([
        {
          $match: {
            _id: { $in: sumTypeImportIds },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
      ]);
      sumTypeImportMoney =
        sumTypeImportResult.length > 0 ? sumTypeImportResult[0].total : 0;
    }
    if (!sumTypeExportIds || sumTypeExportIds?.length == 0) {
      sumTypeExportMoney = 0;
    } else {
      const sumTypeExportResult = await this.inventoryModel.aggregate([
        {
          $match: {
            _id: { $in: sumTypeExportIds },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
      ]);

      sumTypeExportMoney =
        sumTypeExportResult.length > 0 ? sumTypeExportResult[0].total : 0;
    }

    return {
      month,
      year,
      sumTypeImportMoney,
      sumTypeExportMoney,
    };
  }
}
