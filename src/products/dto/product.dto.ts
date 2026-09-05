import { Decimal } from 'generated/prisma/internal/prismaNamespace';

export class ProductDto {
  id!: number;
  name!: string;
  description!: string;
  price!: Decimal;
  stock!: number;
  image_url!: string;

  static select() {
    return {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      image_url: true,
    };
  }
}
