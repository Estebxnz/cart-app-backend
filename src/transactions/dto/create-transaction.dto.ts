export class CreateTransactionDto {
  wallet_id!: number;
  order_id?: number;
  amount!: number;
}
