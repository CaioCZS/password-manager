import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSecureNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  note: string;
}
