import { Injectable } from '@nestjs/common';
import { CreateSecureNoteDto } from './dto/create-secure-note.dto';
import { SecureNotesRepository } from './secure-notes.repository';
import { TitleAlreadyInUse } from '../errors/errors';
import { SecureNotes } from '@prisma/client';
import {
  SecureNoteIsNotFromUser,
  SecureNoteNotFound,
} from './errors/secure-notes.errors';

@Injectable()
export class SecureNotesService {
  constructor(private readonly secureNotesRepository: SecureNotesRepository) {}

  async create(createSecureNoteDto: CreateSecureNoteDto, userId: number) {
    const { title } = createSecureNoteDto;
    await this.verifyTitleAlreadyInUse(title, userId);
    return this.secureNotesRepository.create(createSecureNoteDto, userId);
  }

  async findAll(userId: number) {
    return await this.secureNotesRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const secureNote = await this.secureNotesRepository.findOne(id);
    if (!secureNote) throw new SecureNoteNotFound();
    this.verifySecureNoteIsFromUser(secureNote, userId);

    return secureNote;
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.secureNotesRepository.remove(id);
  }

  private async verifyTitleAlreadyInUse(title: string, userId: number) {
    const secureNote = await this.secureNotesRepository.findByTitle(
      title,
      userId,
    );
    if (secureNote) throw new TitleAlreadyInUse();
  }

  private verifySecureNoteIsFromUser(secureNote: SecureNotes, userId: number) {
    if (secureNote.userId !== userId) throw new SecureNoteIsNotFromUser();
  }
}
