import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prismaService: PrismaService) {}

  createTransaction(transactionDto: TransactionDto) {
    return this.prismaService.transactions.create({
      data: transactionDto,
    });
  }

  async getTransactionById(wallet_id: number, transactionId: number) {
    const transaction = await this.prismaService.transactions.findUnique({
      where: {
        id: transactionId,
        AND: {
          wallet_id: wallet_id,
        },
      },
      include: {
        order: true,
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }
    return transaction;
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
