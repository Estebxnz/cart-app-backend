import { IsInt, IsPositive } from 'class-validator';

export class addItemToCartDto {
  @IsInt()
  @IsPositive()
  quantity!: number;
}
