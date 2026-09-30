import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductDto } from './dto/product.dto';
import { Prisma } from 'generated/prisma/client';
import { SellersService } from 'src/sellers/sellers.service';
import {
  ProductNotFoundException,
  UserNotSellerException,
} from './exceptions/exceptions';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly sellersService: SellersService,
  ) {}

  async create(
    userId: number,
    productDto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<ProductDto> {
    let publicId: string | undefined;

    try {
      const imageData = await this.cloudinary.uploadImage(file);

      publicId = imageData.public_id;

      const seller = await this.sellersService.getSellerByUserId(userId);

      if (!seller) throw new UserNotSellerException();

      const product = await this.prisma.products.create({
        data: {
          ...productDto,
          seller_id: seller.id,
          image_url: imageData.secure_url,
          image_public_id: imageData.public_id,
        },
        include: ProductDto.selectIncludeData(),
      });
      return ProductDto.create(product);
    } catch (error) {
      if (publicId) {
        await this.cloudinary.deleteImage(publicId);
      }

      throw new Error(
        error instanceof Error ? error.message : 'Error creando producto',
      );
    }
  }

  async findAll(): Promise<ProductDto[]> {
    const products = await this.prisma.products.findMany({
      include: ProductDto.selectIncludeData(),
    });
    return ProductDto.createList(products);
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: ProductDto.selectIncludeData(),
    });
    if (!product) throw new ProductNotFoundException();

    return ProductDto.create(product);
  }

  private async findByUserIdAndProductId(userId: number, productId: number) {
    const seller = await this.sellersService.getSellerByUserId(userId);

    if (!seller) throw new UserNotSellerException();

    return this.prisma.products.findUnique({
      where: {
        id: productId,
        AND: {
          seller_id: seller.id,
        },
      },
    });
  }

  async update(
    userId: number,
    id: number,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<ProductDto> {
    const product = await this.findByUserIdAndProductId(userId, id);

    if (!product) throw new ProductNotFoundException(id);

    if (!file) {
      const productDto = this.prisma.products.update({
        where: { id: product.id },
        data: updateProductDto,
        include: ProductDto.selectIncludeData(),
      });
      return ProductDto.create(productDto);
    }
    let publicId: string | undefined;
    try {
      const imageData = await this.cloudinary.uploadImage(file);

      publicId = imageData.public_id;

      const updatedProduct = await this.prisma.products.update({
        where: { id },
        data: {
          ...updateProductDto,
          image_url: imageData.secure_url,
          image_public_id: imageData.public_id,
        },
        include: ProductDto.selectIncludeData(),
      });

      await this.cloudinary.deleteImage(product.image_public_id);

      return ProductDto.create(updatedProduct);
    } catch (error) {
      if (publicId) {
        await this.cloudinary.deleteImage(publicId);
      }

      throw new Error(
        error instanceof Error ? error.message : 'Error updating product',
      );
    }
  }

  async decrementStock(item, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prisma;
    return await db.products.updateMany({
      where: { id: item.product_id, stock: { gte: item.quantity } },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  async remove(userId: number, productId: number): Promise<void> {
    const product = await this.findByUserIdAndProductId(userId, productId);

    if (!product) throw new ProductNotFoundException();

    await this.cloudinary.deleteImage(product.image_public_id);

    await this.prisma.products.delete({
      where: { id: product.id },
    });
  }
}
