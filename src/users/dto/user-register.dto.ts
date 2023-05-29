import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsString()
	@MinLength(8, { message: 'Password must include at least 8' })
	password: string;

	@IsString()
	@MinLength(2)
	name: string;
}
