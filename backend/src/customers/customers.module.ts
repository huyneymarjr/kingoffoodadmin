import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { TablesModule } from 'src/tables/tables.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),

    forwardRef(() => TablesModule),
    forwardRef(() => OrdersModule),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [MongooseModule],
})
export class CustomersModule {}
