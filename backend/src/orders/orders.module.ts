import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { TablesModule } from 'src/tables/tables.module';
import { CustomersModule } from 'src/customers/customers.module';
import { AreasModule } from 'src/areas/areas.module';
import { OrderdetailsModule } from 'src/orderdetails/orderdetails.module';
import { MenusModule } from 'src/menus/menus.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import { PromotionsModule } from 'src/promotions/promotions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => TablesModule),
    forwardRef(() => OrderdetailsModule),
    forwardRef(() => CustomersModule),

    AreasModule,
    MenusModule,
    PaymentsModule,
    UsersModule,
    PromotionsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [MongooseModule],
})
export class OrdersModule {}
