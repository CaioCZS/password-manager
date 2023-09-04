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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
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
import { ResponseCredential } from './dto/response-credential.dto';

@ApiBearerAuth()
@ApiTags('credentials')
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @ApiOperation({ summary: 'Create a credential' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credential created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Title already in use',
  })
  @Post()
  async create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: UserPrisma,
  ) {
    await this.credentialsService.create(createCredentialDto, user.id);
    return { message: 'Credential created' };
  }

  @ApiOperation({ summary: 'Return users credentials' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns credentials',
    type: ResponseCredential,
    isArray: true,
  })
  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.credentialsService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Return a specific credential' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the credential',
    type: ResponseCredential,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential exist but is not from user',
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    return await this.credentialsService.findOne(id, user.id);
  }

  @ApiOperation({ summary: 'Delete a credential' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential exist but is not from user',
  })
  @Delete(':id')
  async remove(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    await this.credentialsService.remove(id, user.id);
    return { message: 'Credential deleted' };
  }
}
