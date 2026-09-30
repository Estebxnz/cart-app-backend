import { PipeTransform } from '@nestjs/common';
import {
  InvalidImageSizeException,
  InvalidImageTypeException,
  ProductImageRequeriedException,
} from '../exceptions/imagesExc/imagesExceptions';

export class imageValidationPipe implements PipeTransform {
  private readonly maxSize = 5 * 1024 * 1024; //5MB
  constructor(private readonly imageRequeried = true) {}
  transform(file?: Express.Multer.File) {
    if (!file && this.imageRequeried)
      throw new ProductImageRequeriedException();

    if (!file) return file;

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype))
      throw new InvalidImageTypeException();

    if (file.size > this.maxSize) throw new InvalidImageSizeException();

    return file;
  }
}
