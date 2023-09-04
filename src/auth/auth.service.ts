import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UsersService } from '../users/users.service';
import { IncompatibleData } from './errors/auth.errors';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private EXPIRATION_TIME = '7 days';
  private ISSUER = 'Caio';
  private AUDIENCE = 'users';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto) {
    await this.usersService.createUser(body);
  }

  async signIn(body: SignInDto) {
    const { email, password } = body;

    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new IncompatibleData();

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) throw new IncompatibleData();

    return this.createToken(user);
  }

  async createToken(user: User) {
    const { id, email } = user;

    const token = this.jwtService.sign(
      { email },
      {
        expiresIn: this.EXPIRATION_TIME,
        issuer: this.ISSUER,
        subject: String(id),
        audience: this.AUDIENCE,
      },
    );

    return { token };
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token, {
      audience: this.AUDIENCE,
      issuer: this.ISSUER,
    });

    return data;
  }
}
