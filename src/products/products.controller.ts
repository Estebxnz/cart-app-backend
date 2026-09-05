import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {} from 'multer';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createProduct(
    @Body('product') productData: string,
    @UploadedFile('file') productImage: Express.Multer.File,
  ) {
    const createProductDto = plainToInstance(
      CreateProductDto,
      JSON.parse(productData),
    );

    const errors = await validate(createProductDto);

    if (errors.length > 0) {
      throw new BadRequestException({
        errors: errors.map((err) => err.constraints),
      });
    }

    return this.productsService.create(createProductDto, productImage);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body('product') productData: string,
    @UploadedFile('file') productImage: Express.Multer.File,
  ) {
    const product = plainToInstance(UpdateProductDto, JSON.parse(productData));

    const errors = await validate(product);

    if (errors.length > 0) {
      throw new BadRequestException({
        errors: errors.map((err) => err.constraints),
      });
    }

    return this.productsService.update(+id, product, productImage);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
