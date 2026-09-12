import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationProductDto } from '../dto/validation-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  async transform(value: string) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(value);
    } catch {
      throw new BadRequestException('JSON inválido');
    }

    const dto = plainToInstance(ValidationProductDto, parsed);

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors.flatMap((error) =>
        Object.values(error.constraints ?? {}),
      );
      throw new BadRequestException(errorMessages);
    }

    return plainToInstance(CreateProductDto, parsed);
  }
}
