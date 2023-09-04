import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'caio@gmail.com', description: 'email for login' })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'str0ngP@ssword', description: 'password for login' })
  password: string;
}
