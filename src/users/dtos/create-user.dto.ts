import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'caio@gmail.com', description: 'email for login' })
  email: string;
  @IsStrongPassword({ minLength: 10 })
  @IsNotEmpty()
  @ApiProperty({ example: 'str0ngP@ssword', description: 'password for login' })
  password: string;
}
