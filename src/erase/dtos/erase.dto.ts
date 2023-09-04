import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EraseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'MySuperSecretPassordAccount',
    description: 'Password used on login',
  })
  password: string;
}
