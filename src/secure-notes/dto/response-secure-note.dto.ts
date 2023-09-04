import { ApiProperty } from '@nestjs/swagger';
import { CreateSecureNoteDto } from './create-secure-note.dto';

export class ResponseSecureNote extends CreateSecureNoteDto {
  @ApiProperty({
    example: 1,
    description: 'Id of secure note',
  })
  id: number;
  @ApiProperty({
    example: new Date(),
    description: 'The moment of secure note created',
  })
  createdAt: Date;
  @ApiProperty({
    example: 1,
    description: 'Id of secure note owner',
  })
  userId: number;
}
