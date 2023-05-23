import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata'; // need to be imported in files that use @injectable & @inject

import { ILogger } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { TYPES } from './types';
import { IUsersController } from './users/users.controller.interface';
import { UsersController } from './users/users.controller';

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUsersController) private usersController: UsersController,
    @inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter
  ) {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use('/users', this.usersController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExceptionFilters();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server running at http://localhost:${this.port}`);
    });
  }
}
