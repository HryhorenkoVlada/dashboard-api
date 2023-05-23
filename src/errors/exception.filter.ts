import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

  catch(
    err: HTTPError | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HTTPError) {
      this.logger.error(
        `Error: [${err.context}] ${err.statusCode} ${err.message}.`
      );
      res.status(err.statusCode).json({ error: err.message });
    } else {
      this.logger.error(err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
