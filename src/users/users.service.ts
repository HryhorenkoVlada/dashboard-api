import { inject, injectable } from 'inversify';
import 'dotenv';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUsersRepository) private usersRepo: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(name, email);
		await newUser.setPassword(password, Number(this.configService.get<number>('SALT')));

		const existedUser = await this.usersRepo.findUserByEmail(email);
		if (existedUser) {
			return null;
		}

		return this.usersRepo.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepo.findUserByEmail(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.name, existedUser.email, existedUser.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepo.findUserByEmail(email);
	}
}
