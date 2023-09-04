import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

export class CredentialFactory {
  private cryptr: Cryptr;
  private url: string;
  private username: string;
  private password: string;
  private title: string;

  constructor(private readonly prisma: PrismaService) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  }

  withUrl() {
    this.url = faker.internet.url();
    return this;
  }

  withTitle(title?: string) {
    this.title = title || faker.music.songName();
    return this;
  }

  withUsername() {
    this.username = faker.person.fullName();
    return this;
  }

  withPassword() {
    this.password = faker.internet.password();
    return this;
  }

  build(userId: number) {
    return {
      url: this.url,
      title: this.title,
      username: this.username,
      password: this.password,
      userId,
    };
  }

  async persist(userId: number) {
    const cretential = this.build(userId);
    return await this.prisma.credential.create({
      data: {
        ...cretential,
        password: this.cryptr.encrypt(cretential.password),
      },
    });
  }
}
