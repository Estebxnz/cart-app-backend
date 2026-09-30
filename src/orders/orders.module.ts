import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletsModule } from 'src/wallets/wallets.module';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { ProductsModule } from 'src/products/products.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    PrismaModule,
    WalletsModule,
    InvoicesModule,
    ProductsModule,
    TransactionsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
