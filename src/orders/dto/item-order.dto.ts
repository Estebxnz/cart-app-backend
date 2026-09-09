import { ItemCartDto } from 'src/cart/dto/item-cart.dto';

export class ItemOrderDto {
  id?: number;
  order_id!: number;
  product_id!: number;
  quantity!: number;
  unitPrice!: number;
  subtotal!: number;

  static create(orderId: number, items: ItemCartDto[]): ItemOrderDto[] {
    return items.map((item) => {
      const itemOrderDto = new ItemOrderDto();
      itemOrderDto.order_id = orderId;
      itemOrderDto.product_id = item.productId;
      itemOrderDto.quantity = item.quantity;
      itemOrderDto.unitPrice = item.price;
      itemOrderDto.subtotal = item.quantity * item.price;

      return itemOrderDto;
    });
  }
}
