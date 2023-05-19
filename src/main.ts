import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';

const bootstrap = async () => {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new UsersController(logger),
    new ExceptionFilter(logger)
  );
  await app.init();
};

bootstrap();
