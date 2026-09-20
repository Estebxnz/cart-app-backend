import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    OrdersModule,
    TransactionsModule,
    WalletsModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
