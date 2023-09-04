/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import { TitleAlreadyInUse } from '../errors/errors';
import { CreditCard } from '@prisma/client';
import { CardIsNotFromUser, CardNotFound } from './errors/card.erros';
import Cryptr from 'cryptr';

@Injectable()
export class CardsService {
  private cryptr: Cryptr;

  constructor(private readonly cardsRepository: CardsRepository) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  }

  async create(createCardDto: CreateCardDto, userId: number) {
    const { title } = createCardDto;
    await this.verifyTitleAlreadyInUse(title, userId);

    await this.cardsRepository.create(createCardDto, userId);
  }

  async findAll(userId: number) {
    const cards = await this.cardsRepository.findAll(userId);

    return this.decryptAllDatas(cards);
  }

  async findOne(id: number, userId: number) {
    const card = await this.cardsRepository.findOne(id);
    if (!card) throw new CardNotFound();

    this.verifyCardIsFromUser(card, userId);

    const { password, securityCode } = card;

    return {
      ...card,
      password: this.decryptData(password),
      securityCode: this.decryptData(securityCode),
    };
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.cardsRepository.remove(id);
  }

  private async verifyTitleAlreadyInUse(title: string, userId: number) {
    const card = await this.cardsRepository.findByTitle(title, userId);
    if (card) throw new TitleAlreadyInUse();
  }

  private verifyCardIsFromUser(card: CreditCard, userId: number) {
    if (card.userId !== userId) throw new CardIsNotFromUser();
  }

  private decryptAllDatas(card: CreditCard[]) {
    return card.map((c) => {
      return {
        ...c,
        password: this.decryptData(c.password),
        securityCode: this.decryptData(c.securityCode),
      };
    });
  }

  private decryptData(data: string) {
    return this.cryptr.decrypt(data);
  }
}
