import { BadRequestException } from '@nestjs/common';

export class ProductImageRequeriedException extends BadRequestException {
  constructor() {
    super('Imagen del producto requerida');
  }
}

export class InvalidImageTypeException extends BadRequestException {
  constructor() {
    super('El archivo debe ser una imagen JPEG, PNG O WEBP');
  }
}

export class InvalidImageSizeException extends BadRequestException {
  constructor() {
    super('La imagen no puede superar los 5 MB');
  }
}
