import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { ExceptionType } from './exception.type';

@Catch(QueryFailedError<DriverError>, TypeORMError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError<DriverError>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const driverError = exception.driverError;
    const responseObject: ExceptionType<any> = {
      statusCode: HttpStatus.BAD_REQUEST,
      error: null,
    };
    let pattern: RegExp;
    let sqlTextList: string[];
    let field: string;

    switch (driverError?.code) {
      case 'ER_DUP_ENTRY':
        responseObject.message = 'errors.existed';
        break;
      case 'ER_ROW_IS_REFERENCED_2':
        pattern = /\`\w+(_\w)*\`/g;
        sqlTextList = driverError.sqlMessage
          .match(pattern)
          .map((e) => e.replace(/\`/g, ''));
        responseObject.message = 'message.delete.error';
        field = sqlTextList.at(-2);
        responseObject.error = { [field]: 'errors.inUsed' };
        responseObject.detail = {
          [field]: { error: 'errors.inUsed', table: sqlTextList.at(1) },
        };
        break;
      default:
        console.error(exception.message, exception.stack, exception.name);
        break;
    }
    response.status(HttpStatus.BAD_REQUEST).json(responseObject);
  }
}

interface DriverError extends Error {
  code: string;
  errno: number;
  sqlState: string;
  sqlMessage: string;
  sql: string;
}
