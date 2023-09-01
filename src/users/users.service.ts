import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { EmailAlreadyInUse } from './errors/user.errors';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(user: CreateUserDto) {
    await this.verifyExistingUser(user.email);
    return await this.usersRepository.create(user);
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    return user;
  }

  private async verifyExistingUser(email: string) {
    const user = await this.getUserByEmail(email);
    if (user) throw new EmailAlreadyInUse();
  }
}
