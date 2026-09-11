import { ItemCartDto } from './item-cart.dto';

export class CartDto {
  id?: number;
  items!: ItemCartDto[];

  static createResponse(cart): CartDto {
    const cartDto = new CartDto();
    cartDto.items = cart.cart_item.map((item) =>
      ItemCartDto.create(item.products, item.quantity),
    );
    return cartDto;
  }

  static create(cart): CartDto {
    const cartDto = new CartDto();
    cartDto.id = cart.id;
    cartDto.items = cart.cart_item.map((item) =>
      ItemCartDto.create(item.products, item.quantity),
    );
    return cartDto;
  }
}
