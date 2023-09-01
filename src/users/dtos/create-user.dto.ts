import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsStrongPassword({ minLength: 10 })
  @IsNotEmpty()
  password: string;
}
