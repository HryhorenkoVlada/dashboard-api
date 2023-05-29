import { Container, ContainerModule, interfaces } from 'inversify';

import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { App } from './app';
import { TYPES } from './types';
import { IUsersController } from './users/users.controller.interface';
import { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';

interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IUsersController>(TYPES.IUsersController).to(UsersController).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUsersService>(TYPES.IUsersService).to(UsersService).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
