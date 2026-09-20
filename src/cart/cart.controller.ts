import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrenUser } from 'src/auth/decorators/current-user.decorator';
import { addItemToCartDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll(@CurrenUser('id') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }

  @Post('addItem/:productId')
  create(
    @CurrenUser('id') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() addItemToCartDto: addItemToCartDto,
  ) {
    return this.cartService.addItemToCart(userId, productId, addItemToCartDto);
  }

  @Patch(':itemId')
  updateItem(
    @CurrenUser('id') userId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(userId, itemId, updateItemDto);
  }

  @Delete(':productId')
  removeItem(
    @CurrenUser('id') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Post('pay')
  payCart(@CurrenUser('id') userId: number) {
    return this.cartService.payCart(userId);
  }
}
