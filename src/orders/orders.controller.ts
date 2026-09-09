import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrenUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@CurrenUser('id') userId: number) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrenUser('id') userId: number, @Param('id') orderId: string) {
    return this.ordersService.findOne(userId, +orderId);
  }
}
