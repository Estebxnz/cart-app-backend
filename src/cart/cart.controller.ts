import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrenUser } from 'src/auth/decorators/current-user.decorator';
import { addItemToCartDto } from './dto/create-cart.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('addItem')
  create(
    @CurrenUser('id') userId: number,
    @Body() addItemToCartDto: addItemToCartDto,
  ) {
    return this.cartService.addItemToCart(userId, addItemToCartDto);
  }

  @Get()
  findAll(@CurrenUser('id') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }

  @Delete(':productId')
  removeItem(
    @CurrenUser('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(userId, +productId);
  }
}
