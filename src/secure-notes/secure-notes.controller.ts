import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SecureNotesService } from './secure-notes.service';
import { CreateSecureNoteDto } from './dto/create-secure-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ParseIdPipe } from '../pipes/id.pipe';
@UseGuards(AuthGuard)
@Controller('secure-notes')
export class SecureNotesController {
  constructor(private readonly secureNotesService: SecureNotesService) {}

  @Post()
  async create(
    @Body() createSecureNoteDto: CreateSecureNoteDto,
    @User() user: UserPrisma,
  ) {
    await this.secureNotesService.create(createSecureNoteDto, user.id);
    return { message: 'Secure note created' };
  }

  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.secureNotesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    return await this.secureNotesService.findOne(id, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    await this.secureNotesService.remove(id, user.id);
    return { message: 'Secure note deleted' };
  }
}
