import { Container } from 'inversify';
import { UserModel } from '@prisma/client';
import 'reflect-metadata';

import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { TYPES } from '../types';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	findUserByEmail: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepo: IUsersRepository;
let usersService: IUsersService;

let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.IUsersService).to(UsersService).inSingletonScope();
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.IConfigService);
	usersService = container.get<IUsersService>(TYPES.IUsersService);
	usersRepo = container.get<IUsersRepository>(TYPES.IUsersRepository);
});

describe('UsersService', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce(1);
		usersRepo.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
			return {
				id: 1,
				createdAt: new Date(),
				email: user.email,
				name: user.name,
				password: user.password,
			};
		});
		createdUser = await usersService.createUser({
			email: 'a@a.com',
			name: 'a',
			password: 'a',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('a');
	});

	describe('validateUser', () => {
		it('should return true if user exists and password is correct', async () => {
			usersRepo.findUserByEmail = jest.fn().mockReturnValueOnce(createdUser);
			const result = await usersService.validateUser({
				email: 'a@a.com',
				password: 'a',
			});
			expect(result).toBeTruthy();
		});
		it('should return false if password is incorrect', async () => {
			const result = await usersService.validateUser({
				email: 'a@a.com',
				password: 'b',
			});
			expect(result).toBeFalsy();
		});
		it('should return false if user does not exist', async () => {
			usersRepo.findUserByEmail = jest.fn().mockReturnValueOnce(null);
			const result = await usersService.validateUser({
				email: 'a@2a.com',
				password: 'a',
			});
			expect(result).toBeFalsy();
		});
	});
});
