import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { ParseIdPipe } from '../pipes/id.pipe';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  async create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: UserPrisma,
  ) {
    await this.credentialsService.create(createCredentialDto, user.id);
    return { message: 'Credential created' };
  }

  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.credentialsService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    return this.credentialsService.findOne(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIdPipe()) id: number, @User() user: UserPrisma) {
    return this.credentialsService.remove(id, user.id);
  }
}
