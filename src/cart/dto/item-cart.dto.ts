export class ItemCartDto {
  productId!: number;
  name!: string;
  description!: string;
  price!: number;
  quantity!: number;

  static selectProductData() {
    return {
      id: true,
      name: true,
      description: true,
      price: true,
    };
  }
  static create(product, quantity: number): ItemCartDto {
    const itemCartDto = new ItemCartDto();
    itemCartDto.productId = product.id;
    itemCartDto.name = product.name;
    itemCartDto.description = product.description;
    itemCartDto.price = product.price;
    itemCartDto.quantity = quantity;
    return itemCartDto;
  }
}
