import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { Table, TableSchema } from './schemas/table.schema';
import { CustomersModule } from 'src/customers/customers.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),

    forwardRef(() => OrdersModule),
    forwardRef(() => CustomersModule),
    PaymentsModule,
  ],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [MongooseModule],
})
export class TablesModule {}
