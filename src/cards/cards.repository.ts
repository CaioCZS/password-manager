/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { PrismaService } from '../prisma/prisma.service';
import Cryptr from 'cryptr';

@Injectable()
export class CardsRepository {
  private cryptr: Cryptr;
  constructor(private readonly prisma: PrismaService) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  }

  create(createCardDto: CreateCardDto, userId: number) {
    const { password, securityCode, expirationDate } = createCardDto;

    return this.prisma.creditCard.create({
      data: {
        ...createCardDto,
        userId,
        password: this.cryptr.encrypt(password),
        securityCode: this.cryptr.encrypt(securityCode),
        expirationDate: new Date(expirationDate),
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.creditCard.findMany({ where: { userId } });
  }

  findOne(id: number) {
    return this.prisma.creditCard.findUnique({ where: { id } });
  }

  findByTitle(title: string, userId: number) {
    return this.prisma.creditCard.findFirst({ where: { title, userId } });
  }

  remove(id: number) {
    return this.prisma.creditCard.delete({ where: { id } });
  }
}
