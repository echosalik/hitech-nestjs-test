import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter<T> implements ExceptionFilter {
  catch(e: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    if (e instanceof NotFoundError) {
      return response.status(404).json({
        error: e.message,
      });
    } else if (e instanceof BadRequestException) {
      return response.status(400).json({
        error: (e.getResponse() as any).message.join(', '),
      });
    } else if (e instanceof UniqueConstraintViolationException) {
      return response.status(500).json({
        error: e.message,
      });
    } else {
      return response.status(500).json({
        error: (e as Error).message,
      });
    }
  }
}
