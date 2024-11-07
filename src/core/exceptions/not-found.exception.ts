import { BadRequestException, HttpStatus } from '@nestjs/common';

export class NotFound<T> extends BadRequestException {
  constructor(field?: keyof T, message?: string) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      error: field ? { [field]: 'notFound' } : undefined,
    });
  }
}
