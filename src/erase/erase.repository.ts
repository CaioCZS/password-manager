import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EraseRepository {
  constructor(private readonly prisma: PrismaService) {}

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
