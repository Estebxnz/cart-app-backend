import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(
    productDto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<ProductDto> {
    let publicId: string | undefined;

    try {
      const imageData = await this.cloudinary.uploadImage(file);

      publicId = imageData.public_id;

      return await this.prisma.products.create({
        data: {
          ...productDto,
          image_url: imageData.secure_url,
          image_public_id: imageData.public_id,
        },
        select: ProductDto.select(),
      });
    } catch (error) {
      if (publicId) {
        await this.cloudinary.deleteImage(publicId);
      }

      throw new Error(
        error instanceof Error ? error.message : 'Error creating product',
      );
    }
  }

  findAll(): Promise<ProductDto[]> {
    return this.prisma.products.findMany({
      select: ProductDto.select(),
    });
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      select: ProductDto.select(),
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
  async findOneEntity(id: number) {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<ProductDto> {
    const product = await this.findOneEntity(id);

    if (!file) {
      return this.prisma.products.update({
        where: { id: product.id },
        data: updateProductDto,
        select: ProductDto.select(),
      });
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
        select: ProductDto.select(),
      });

      await this.cloudinary.deleteImage(product.image_public_id);

      return updatedProduct;
    } catch (error) {
      if (publicId) {
        await this.cloudinary.deleteImage(publicId);
      }

      throw new Error(
        error instanceof Error ? error.message : 'Error updating product',
      );
    }
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOneEntity(id);

    await this.cloudinary.deleteImage(product.image_public_id);

    await this.prisma.products.delete({
      where: { id: product.id },
    });
  }
}
