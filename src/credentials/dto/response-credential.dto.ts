import { ApiProperty } from '@nestjs/swagger';
import { CreateCredentialDto } from './create-credential.dto';

export class ResponseCredential extends CreateCredentialDto {
  @ApiProperty({
    example: 1,
    description: 'Id of credential',
  })
  id: number;
  @ApiProperty({
    example: new Date(),
    description: 'The moment of credential created',
  })
  createdAt: Date;
  @ApiProperty({
    example: 1,
    description: 'Id of credential owner',
  })
  userId: number;
}
