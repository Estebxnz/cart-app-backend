import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: string) {
    return JSON.parse(value);
  }
}
