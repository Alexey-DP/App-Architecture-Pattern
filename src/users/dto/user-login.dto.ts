import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Email is incorrectly indicated' })
	email: string;

	@IsString({ message: 'Password is not indicated' })
	password: string;
}
