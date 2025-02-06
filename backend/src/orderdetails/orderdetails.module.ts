import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderdetailsService } from './orderdetails.service';
import { OrderdetailsController } from './orderdetails.controller';
import { Orderdetail, OrderdetailSchema } from './schemas/orderdetail.schema';
import { OrdersModule } from 'src/orders/orders.module';
import { MenusModule } from 'src/menus/menus.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orderdetail.name, schema: OrderdetailSchema },
    ]),

    forwardRef(() => OrdersModule),
    MenusModule,
    PaymentsModule,
  ],
  controllers: [OrderdetailsController],
  providers: [OrderdetailsService],
  exports: [MongooseModule],
})
export class OrderdetailsModule {}
