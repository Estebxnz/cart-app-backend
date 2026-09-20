import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemOrderDto } from './dto/item-order.dto';
import { CartDto } from 'src/cart/dto/cart.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { TransactionType } from 'generated/prisma/enums';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletService: WalletsService,
  ) {}
  async create(userId: number, cart: CartDto) {
    return this.prismaService.$transaction(async (tx) => {
      cart.items.forEach((item) => {
        if (item.quantity > item.productStock) {
          throw new BadRequestException(
            `Producto: ${item.name} no tiene la cantidad requerida. Stock disponible: ${item.productStock}`,
          );
        }
      });

      const totalValueCart = cart.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      const wallet = await this.walletService.getWalletByUserId(userId);

      if (wallet.balance.lessThan(totalValueCart)) {
        throw new BadRequestException('Saldo insuficiente');
      }

      const order = await tx.orders.create({
        data: { user_id: userId, total: totalValueCart },
      });

      const orderItems = await tx.order_items.createManyAndReturn({
        data: ItemOrderDto.create(order.id, cart.items),
      });

      for (const item of orderItems) {
        const product = await tx.products.updateMany({
          where: { id: item.product_id, stock: { gte: item.quantity } },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
        if (product.count === 0) {
          throw new ConflictException(
            `ProductId: #${item.product_id}: Stock insuficiente`,
          );
        }
      }

      const transactionData = {
        wallet_id: wallet.id,
        order_id: order.id,
        type: TransactionType.PURCHASE,
        amount: totalValueCart,
      };

      return { order, transactionData };
    });
  }

  async findAll(userId: number) {
    const orders = await this.prismaService.orders.findMany({
      where: { user_id: userId },
    });
    return { orders };
  }

  findOne(userId: number, orderId: number) {
    return this.prismaService.orders.findUnique({
      where: {
        user_id: userId,
        id: orderId,
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });
  }
}
