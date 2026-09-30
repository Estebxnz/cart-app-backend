import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AmountDto } from './dto/wallet.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class WalletsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionsServices: TransactionsService,
  ) {}

  create(userId: number, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prismaService;
    return db.wallet.create({
      data: { user_id: userId },
      select: { id: true, balance: true },
    });
  }

  getBalanceByUserId(userId: number) {
    return this.prismaService.wallet.findUniqueOrThrow({
      where: { user_id: userId },
      select: {
        balance: true,
      },
    });
  }

  async deposit(
    userId: number,
    amountDto: AmountDto,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prismaService;
    const wallet = await db.wallet.update({
      where: { user_id: userId },
      data: {
        balance: {
          increment: amountDto.amount,
        },
      },
      select: {
        id: true,
        balance: true,
      },
    });

    const transactionData = {
      wallet_id: wallet.id,
      amount: amountDto.amount,
    };

    await this.transactionsServices.createDeposit(transactionData, tx);

    return {
      wallet: {
        balance: wallet.balance,
      },
    };
  }

  withdraw(
    userId: number,
    amountDto: AmountDto,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prismaService;
    return db.wallet.update({
      where: { user_id: userId },
      data: {
        balance: {
          decrement: amountDto.amount,
        },
      },
    });
  }

  getWalletByUserId(userId: number) {
    return this.prismaService.wallet.findUniqueOrThrow({
      where: {
        user_id: userId,
      },
    });
  }

  async getTransactions(userId: number) {
    const wallet = await this.getWalletByUserId(userId);
    return this.transactionsServices.getTransactionsByWalletId(wallet.id);
  }

  async getTransaction(userId: number, transactionId: number) {
    const wallet = await this.getWalletByUserId(userId);
    return this.transactionsServices.getTransactionByIdAndWalletId(
      wallet.id,
      transactionId,
    );
  }
}
