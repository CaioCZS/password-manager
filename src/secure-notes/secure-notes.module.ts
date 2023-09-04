import { Module } from '@nestjs/common';
import { SecureNotesService } from './secure-notes.service';
import { SecureNotesController } from './secure-notes.controller';
import { UsersModule } from '../users/users.module';
import { SecureNotesRepository } from './secure-notes.repository';

@Module({
  imports: [UsersModule],
  controllers: [SecureNotesController],
  providers: [SecureNotesService, SecureNotesRepository],
})
export class SecureNotesModule {}
