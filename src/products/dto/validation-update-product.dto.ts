import { PartialType } from '@nestjs/mapped-types';
import { ValidationCreateProductDto } from './validation-create-product.dto';

export class ValidationUpdateProductDto extends PartialType(
  ValidationCreateProductDto,
) {}
