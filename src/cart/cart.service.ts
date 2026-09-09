import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addItemToCartDto } from './dto/create-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { ItemCartDto } from './dto/item-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async getCartByUserId(userId: number) {
    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
      include: {
        cart_item: {
          include: { products: { select: ItemCartDto.selectProductData() } },
        },
      },
    });
    if (!cart) {
      throw new BadRequestException(
        'Este usuario no tiene un carrito asociado',
      );
    }
    return {
      items: cart.cart_item.map((item) =>
        ItemCartDto.create(item.products, item.quantity),
      ),
    };
  }

  async addItemToCart(userId: number, addItemToCartDto: addItemToCartDto) {
    const { productId, quantity } = addItemToCartDto;

    const product = await this.productsService.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException(
        'Este producto no tiene suficiente stock disponible',
      );
    }

    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
      select: { id: true },
    });

    if (!cart) {
      throw new BadRequestException(
        'Este usuario no tiene un carrito asociado',
      );
    }

    const cartItem = await this.prismaService.cart_item.create({
      data: {
        cart_id: cart.id,
        product_id: productId,
        quantity: quantity,
      },
      include: {
        products: { select: ItemCartDto.selectProductData() },
      },
    });

    return ItemCartDto.create(cartItem.products, cartItem.quantity);
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.prismaService.cart.findUnique({
      where: { user_id: userId },
      include: { cart_item: true },
    });

    if (!cart) {
      throw new NotFoundException('Este usuario no tiene carrito asociado');
    }

    const itemsId = cart.cart_item.map((item) => item.product_id);

    if (!itemsId.includes(productId)) {
      throw new NotFoundException(
        'Este producto no se encunetra en el carrito',
      );
    }

    return this.prismaService.cart_item.delete({
      where: {
        cart_id_product_id: { cart_id: cart.id, product_id: productId },
      },
    });
  }
}
