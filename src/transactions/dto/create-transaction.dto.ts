import { TransactionType } from 'generated/prisma/enums';

export class TransactionDto {
  wallet_id!: number;
  order_id?: number;
  type!: TransactionType;
  amount!: number;
}
