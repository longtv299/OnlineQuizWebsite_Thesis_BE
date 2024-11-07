import { HttpStatus, UnauthorizedException } from '@nestjs/common';

export class Unauthorized extends UnauthorizedException {
  constructor(message?: string) {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: message || 'unauthorized',
    });
  }
}
