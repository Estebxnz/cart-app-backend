import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemOrderDto } from './dto/item-order.dto';
import { CartDto } from 'src/cart/dto/cart.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { InvoiceInfoDto } from 'src/invoices/dto/invoice-info.dto';
import { ProductsService } from 'src/products/products.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly transactionsService: TransactionsService,
    private readonly walletService: WalletsService,
    private readonly invoicesService: InvoicesService,
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
        const product = await this.productsService.decrementStock(item, tx);

        if (product.count === 0) {
          throw new ConflictException(
            `ProductId: #${item.product_id}: Stock insuficiente`,
          );
        }
      }
      await this.walletService.withdraw(userId, { amount: totalValueCart }, tx);

      const transactionData = {
        wallet_id: wallet.id,
        order_id: order.id,
        amount: totalValueCart,
      };

      await this.transactionsService.createPurchase(transactionData, tx);

      return order;
    });
  }

  async findAll(userId: number) {
    const orders = await this.prismaService.orders.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        total: true,
        created_at: true,
      },
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

  async generateInvoice(userId: number, orderId: number) {
    const order = await this.prismaService.orders.findUnique({
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
        users: true,
      },
    });

    return await this.invoicesService.generateInvoice(
      InvoiceInfoDto.create(order),
    );
  }
}
