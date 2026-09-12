import {
  BadRequestException,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const imageValidationPipe = new ParseFilePipe({
  fileIsRequired: true,
  exceptionFactory: () => new BadRequestException('Imagen requerida'),
  validators: [
    new FileTypeValidator({
      fileType: /^image\/(jpeg|png|webp)$/,
      errorMessage: 'El tipo de imagen debe ser JPG, PNG o WEBP',
    }),
  ],
});
