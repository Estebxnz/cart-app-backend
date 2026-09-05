import { PartialType } from '@nestjs/mapped-types';
import { addItemToCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(addItemToCartDto) {}
