import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import {
  CredentialIsNotFromUser,
  CredentialNotFound,
  TitleAlreadyInUse,
} from './errors/credential.errors';
import { Credential } from '@prisma/client';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsService {
  private cryptr: Cryptr;
  constructor(private readonly credentialsRepository: CredentialsRepository) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_SECRET);
  }

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    await this.verifyTitleAlreadyInUse(createCredentialDto.title, userId);

    return await this.credentialsRepository.create(createCredentialDto, userId);
  }

  async findAll(userId: number) {
    return await this.credentialsRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const credential = await this.credentialsRepository.findOne(id);
    if (!credential) throw new CredentialNotFound();
    this.verifyCredentialIsFromUser(credential, userId);
    const { password } = credential;

    return { ...credential, password: this.decryptPassword(password) };
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.credentialsRepository.remove(id);
  }

  async verifyTitleAlreadyInUse(title: string, userId: number) {
    const credential = await this.credentialsRepository.findByTitle(
      title,
      userId,
    );
    if (credential) throw new TitleAlreadyInUse();
  }

  verifyCredentialIsFromUser(credential: Credential, userId: number) {
    if (credential.userId !== userId) throw new CredentialIsNotFromUser();
  }

  decryptPassword(password: string) {
    return this.cryptr.decrypt(password);
  }
}
