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
  title: string;
  @IsString()
  @IsNotEmpty()
  creditNumber: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  securityCode: string;
  @IsDateString()
  @IsNotEmpty()
  expirationDate: Date;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsBoolean()
  @IsNotEmpty()
  isVirtual: boolean;
  @IsNotEmpty()
  @IsEnum(CardType)
  type: CardType;
}
