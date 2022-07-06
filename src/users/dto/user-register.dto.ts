import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Email is incorrectly indicated' })
	email: string;

	@IsString({ message: 'Password is not indicated' })
	@Length(6, 32, { message: 'Password should consist for 4 to 32 characters' })
	password: string;

	@IsString({ message: 'Name is not indicated' })
	@MinLength(4, { message: 'Name should consist of min 4 characters' })
	name: string;
}
