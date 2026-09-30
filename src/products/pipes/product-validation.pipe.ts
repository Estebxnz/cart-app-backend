import { BadRequestException, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationCreateProductDto } from '../dto/validation-create-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';

export class ProductValidationPipe implements PipeTransform {
  constructor(
    private readonly validationClass: new () => object = ValidationCreateProductDto,
    private readonly dtoClass: new () => object = CreateProductDto,
  ) {}
  async transform(value: string) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(value);
    } catch {
      throw new BadRequestException('JSON inválido');
    }

    const dto = plainToInstance(this.validationClass, parsed);

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) =>
        Object.values(error.constraints ?? {}),
      );
      throw new BadRequestException(errorMessages);
    }

    return plainToInstance(this.dtoClass, parsed);
  }
}
