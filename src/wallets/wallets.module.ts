import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [PrismaModule, TransactionsModule],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
