import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { AmountDto } from './dto/wallet.dto';
import { CurrenUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('deposit')
  deposit(@CurrenUser('id') userId: number, @Body() amount: AmountDto) {
    return this.walletsService.deposit(userId, amount);
  }

  @Get('transactions')
  getTransactions(@CurrenUser('id') userId: number) {
    return this.walletsService.getTransactions(userId);
  }
  @Get('transactions/:id')
  getTransaction(
    @CurrenUser('id') userId: number,
    @Param('id') transactionId: number,
  ) {
    return this.walletsService.getTransaction(userId, transactionId);
  }
}
