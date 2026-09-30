import { TransactionType } from 'generated/prisma/enums';

export class TransactionDto {
  id!: number;
  type!: TransactionType;
  amount!: number;
  created_at!: Date;
  order_id?: number;

  static create(transaction) {
    const transactionDto = new TransactionDto();
    transactionDto.id = transaction.id;
    transactionDto.type = transaction.type;
    transactionDto.amount = transaction.amount;
    transactionDto.created_at = transaction.created_at;
    transactionDto.order_id = transaction.order_id;
    return transactionDto;
  }
}
