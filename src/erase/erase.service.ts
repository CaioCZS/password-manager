import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EraseRepository } from './erase.repository';
import { EraseDto } from './dtos/erase.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class EraseService {
  constructor(private readonly eraseRepository: EraseRepository) {}

  async delete(body: EraseDto, user: User) {
    await this.verifyPassword(body, user.password);

    await this.eraseRepository.delete(user.id);
  }

  private async verifyPassword(body: EraseDto, password: string) {
    const verify = await bcrypt.compare(body.password, password);

    if (!verify)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
