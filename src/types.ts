// this file will be used to define types which we will use to connect injecactable with components

export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	IUsersController: Symbol.for('IUsersController'),
	IExceptionFilter: Symbol.for('IExceptionFilter'),
	IUsersService: Symbol.for('IUsersService'),
	IConfigService: Symbol.for('IConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	IUsersRepository: Symbol.for('IUsersRepository'),
};
