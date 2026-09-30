import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TransactionType } from 'generated/prisma/client';
import { TransactionDto } from './dto/transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  createDeposit(
    transactionDto: CreateTransactionDto,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prismaService;
    return db.transactions.create({
      data: { ...transactionDto, type: TransactionType.DEPOSIT },
    });
  }

  createPurchase(
    transactionDto: CreateTransactionDto,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prismaService;
    return db.transactions.create({
      data: { ...transactionDto, type: TransactionType.PURCHASE },
    });
  }
  createSale(
    transactionDto: CreateTransactionDto,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prismaService;
    return db.transactions.create({
      data: { ...transactionDto, type: TransactionType.SALE },
    });
  }

  async getTransactionByIdAndWalletId(
    walletId: number,
    transactionId: number,
  ): Promise<TransactionDto> {
    const transaction = await this.prismaService.transactions.findUnique({
      where: {
        id: transactionId,
        wallet_id: walletId,
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }
    return TransactionDto.create(transaction);
  }

  getTransactionsByWalletId(walletId: number) {
    return this.prismaService.transactions.findMany({
      where: {
        wallet_id: walletId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
