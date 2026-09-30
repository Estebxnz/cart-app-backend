import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ProductNotFoundException extends NotFoundException {
  constructor(productId?: number) {
    super(
      productId
        ? `Producto con ID: ${productId} no encontrado`
        : 'Producto no encontrado',
    );
  }
}

export class UserNotSellerException extends BadRequestException {
  constructor() {
    super('El usuario aún no es vendedor');
  }
}
