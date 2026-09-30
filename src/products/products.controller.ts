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
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {} from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { imageValidationPipe } from './pipes/image-validation.pipe';
import { Role } from 'src/common/enums/role.enum';
import { CurrenUser } from 'src/auth/decorators/current-user.decorator';
import { ProductValidationPipe } from './pipes/product-validation.pipe';
import { ValidationUpdateProductDto } from './dto/validation-update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createProduct(
    @CurrenUser('id') userId: number,
    @Body('product', ProductValidationPipe)
    productData: CreateProductDto,
    @UploadedFile('file', imageValidationPipe)
    productImage: Express.Multer.File,
  ) {
    return this.productsService.create(userId, productData, productImage);
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @CurrenUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body(
      'product',
      new ProductValidationPipe(ValidationUpdateProductDto, UpdateProductDto),
    )
    productData: UpdateProductDto,
    @UploadedFile('file', new imageValidationPipe(false))
    productImage: Express.Multer.File,
  ) {
    return this.productsService.update(userId, id, productData, productImage);
  }

  @Roles(Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(
    @CurrenUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.remove(userId, id);
  }
}
