import { IsOptional, IsString } from 'class-validator';

export class CreateSellerDto {
  @IsOptional()
  @IsString()
  storeName?: string;
}
