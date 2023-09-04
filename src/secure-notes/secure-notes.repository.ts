import { Injectable } from '@nestjs/common';
import { CreateSecureNoteDto } from './dto/create-secure-note.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecureNotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createSecureNoteDto: CreateSecureNoteDto, userId: number) {
    return this.prisma.secureNotes.create({
      data: { ...createSecureNoteDto, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.secureNotes.findMany({ where: { userId } });
  }

  findOne(id: number) {
    return this.prisma.secureNotes.findUnique({ where: { id } });
  }

  findByTitle(title: string, userId: number) {
    return this.prisma.secureNotes.findFirst({ where: { title, userId } });
  }
  remove(id: number) {
    return this.prisma.secureNotes.delete({ where: { id } });
  }
}
