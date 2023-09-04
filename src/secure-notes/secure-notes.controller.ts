import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { SecureNotesService } from './secure-notes.service';
import { CreateSecureNoteDto } from './dto/create-secure-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ParseIdPipe } from '../pipes/id.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseSecureNote } from './dto/response-secure-note.dto';
@ApiBearerAuth()
@ApiTags('secure-notes')
@UseGuards(AuthGuard)
@Controller('secure-notes')
export class SecureNotesController {
  constructor(private readonly secureNotesService: SecureNotesService) {}

  @ApiOperation({ summary: 'Create a secure note' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Secure note created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Title already in use',
  })
  @Post()
  async create(
    @Body() createSecureNoteDto: CreateSecureNoteDto,
    @User() user: UserPrisma,
  ) {
    await this.secureNotesService.create(createSecureNoteDto, user.id);
    return { message: 'Secure note created' };
  }

  @ApiOperation({ summary: 'Return users secure notes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns secure notes',
    type: ResponseSecureNote,
    isArray: true,
  })
  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.secureNotesService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Return a specific secure note' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the secure note',
    type: ResponseSecureNote,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Secure note does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Secure note exist but is not from user',
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    return await this.secureNotesService.findOne(id, user.id);
  }

  @ApiOperation({ summary: 'Delete a secure note' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Secure note deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Secure note does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Secure note exist but is not from user',
  })
  @Delete(':id')
  async remove(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    await this.secureNotesService.remove(id, user.id);
    return { message: 'Secure note deleted' };
  }
}
