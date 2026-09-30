import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrenUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@CurrenUser('id') userId: number) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @CurrenUser('id') userId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.findOne(userId, orderId);
  }
  @Get(':id/pdf')
  async generateInvoice(
    @CurrenUser('id') userId: number,
    @Param('id', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.ordersService.generateInvoice(userId, orderId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="invoice-${orderId}.pdf"`,
    );

    res.send(Buffer.from(pdfBuffer));
  }
}
