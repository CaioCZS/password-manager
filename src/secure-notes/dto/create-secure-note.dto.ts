import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSecureNoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'My security note title',
    description: 'Title for security node',
  })
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'My super secret',
    description: 'The content of security note',
  })
  note: string;
}
