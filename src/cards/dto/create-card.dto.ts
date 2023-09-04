import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'My card title',
    description: 'Title for card',
  })
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5302 1725 5681 8608',
    description: 'Number of card',
  })
  creditNumber: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Caio de Souza',
    description: 'Name on card',
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '712',
    description: 'Security code on card',
  })
  securityCode: string;
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-09-04',
    description: 'Expiration date of card',
  })
  expirationDate: Date;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'MyCardPassword',
    description: 'Password for card',
  })
  password: string;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Indicates if card is virtual or not',
  })
  isVirtual: boolean;
  @IsNotEmpty()
  @IsEnum(CardType)
  @ApiProperty({
    example: 'CREDITO',
    description: 'Indicates the type of card',
    enum: CardType,
  })
  type: CardType;
}
