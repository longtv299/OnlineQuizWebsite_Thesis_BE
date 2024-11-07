import { HttpStatus } from '@nestjs/common';

export interface ExceptionType<T> {
  statusCode: HttpStatus;
  message?: string;
  error: { [k in keyof T]: string };
}
