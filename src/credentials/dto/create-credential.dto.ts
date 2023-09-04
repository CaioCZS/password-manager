import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'My credential title',
    description: 'Title for credential',
  })
  title: string;
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://siteaccount.com.br',
    description: 'Url of site account',
  })
  url: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'MyUsernameOnSite',
    description: 'Username on site',
  })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'MySuperSecretPassword',
    description: 'Password on site',
  })
  password: string;
}
