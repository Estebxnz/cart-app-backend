import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrenUser } from 'src/auth/decorators/current-user.decorator';
import { CreateSellerDto } from './dto/create-seller.dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('activate')
  activateSeller(
    @CurrenUser('id') userId: number,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    return this.sellersService.createSeller(userId, createSellerDto);
  }
}
