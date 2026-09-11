import { PartialType } from '@nestjs/mapped-types';
import { addItemToCartDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(addItemToCartDto) {}
