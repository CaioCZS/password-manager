import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  private email: string;
  private password: string;
  constructor(private readonly prisma: PrismaService) {}

  withWeakPassword() {
    this.password = '123';
    return this;
  }

  withStrongPassword() {
    this.password = 'Str0ngP@ssword';
    return this;
  }

  withEmail(email?: string) {
    this.email = email || faker.internet.email();
    return this;
  }

  build() {
    return {
      email: this.email,
      password: this.password,
    };
  }

  async persist() {
    const user = this.build();
    const created = await this.prisma.user.create({
      data: { email: user.email, password: bcrypt.hashSync(user.password, 10) },
    });

    return { descriptedPassword: user.password, ...created };
  }
}
