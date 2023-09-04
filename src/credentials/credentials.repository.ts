import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { PrismaService } from '../prisma/prisma.service';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsRepository {
  private cryptr: Cryptr;

  constructor(private readonly prisma: PrismaService) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  }

  create(createCredentialDto: CreateCredentialDto, userId: number) {
    const { password } = createCredentialDto;

    return this.prisma.credential.create({
      data: {
        ...createCredentialDto,
        password: this.cryptr.encrypt(password),
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.credential.findMany({ where: { userId } });
  }

  findOne(id: number) {
    return this.prisma.credential.findUnique({ where: { id } });
  }

  findByTitle(title: string, userId: number) {
    return this.prisma.credential.findFirst({ where: { title, userId } });
  }

  remove(id: number) {
    return this.prisma.credential.delete({ where: { id } });
  }
}
