import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesModule } from 'src/roles/roles.module';
import { WalletsModule } from 'src/wallets/wallets.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [PrismaModule, WalletsModule, RolesModule, TransactionsModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
