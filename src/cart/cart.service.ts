import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { OrdersService } from 'src/orders/orders.service';
import { ItemCartDto } from './dto/item-cart.dto';
import { addItemToCartDto } from './dto/create-item.dto';
import { CartDto } from './dto/cart.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly transactionsService: TransactionsService,
    private readonly walletService: WalletsService,
  ) {}

  async getCartByUserId(userId: number): Promise<CartDto> {
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
    return CartDto.createResponse(cart);
  }
  private async getCartEntityByUserId(userId: number): Promise<CartDto> {
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
    return CartDto.create(cart);
  }

  async addItemToCart(
    userId: number,
    productId: number,
    addItemToCartDto: addItemToCartDto,
  ): Promise<ItemCartDto> {
    const { quantity } = addItemToCartDto;

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

  async updateItem(
    userId: number,
    itemId: number,
    updateItemDto: UpdateItemDto,
  ) {
    const cart = await this.getCartEntityByUserId(userId);

    return await this.prismaService.cart_item.update({
      where: { id: itemId, cart_id: cart.id },
      data: updateItemDto,
    });
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

  emptyCart(cartId: number) {
    return this.prismaService.cart_item.deleteMany({
      where: { cart_id: cartId },
    });
  }

  async payCart(userId: number) {
    const cart = await this.getCartEntityByUserId(userId);

    const result = await this.ordersService.create(userId, cart);

    const { order, transactionData } = result;

    await this.transactionsService.createTransaction(transactionData);

    await this.walletService.withdraw(userId, {
      amount: transactionData.amount,
    });

    if (cart.id) {
      await this.emptyCart(cart.id);
    }

    return order;
  }
}
