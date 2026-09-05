import { IsInt, IsPositive } from 'class-validator';

export class addItemToCartDto {
  @IsInt()
  @IsPositive()
  productId!: number;
  @IsInt()
  @IsPositive()
  quantity!: number;
}
