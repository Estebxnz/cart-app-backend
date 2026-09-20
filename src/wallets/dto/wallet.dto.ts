import { IsNumber, IsPositive } from 'class-validator';

export class AmountDto {
  @IsNumber()
  @IsPositive()
  amount!: number;
}
