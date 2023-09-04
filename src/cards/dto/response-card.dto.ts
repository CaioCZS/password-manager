import { ApiProperty } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';

export class ResponseCard extends CreateCardDto {
  @ApiProperty({
    example: 1,
    description: 'Id of card',
  })
  id: number;
  @ApiProperty({
    example: new Date(),
    description: 'The moment of card created',
  })
  createdAt: Date;
  @ApiProperty({
    example: 1,
    description: 'Id of card owner',
  })
  userId: number;
}
