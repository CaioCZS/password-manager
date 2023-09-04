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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user.decorator';
import { ParseIdPipe } from '../pipes/id.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseCard } from './dto/response-card.dto';

@ApiBearerAuth()
@ApiTags('cards')
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Create a card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Card created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Title already in use',
  })
  @Post()
  async create(@Body() createCardDto: CreateCardDto, @User() user: UserPrisma) {
    await this.cardsService.create(createCardDto, user.id);
    return { message: 'Card created' };
  }

  @ApiOperation({ summary: 'Return users cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns cards',
    type: ResponseCard,
    isArray: true,
  })
  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.cardsService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Return a specific card' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the card',
    type: ResponseCard,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card exist but is not from user',
  })
  @Get(':id')
  async findOne(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    return this.cardsService.findOne(id, user.id);
  }

  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card does not exist',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card exist but is not from user',
  })
  @Delete(':id')
  async remove(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    await this.cardsService.remove(id, user.id);
    return { message: 'Card deleted' };
  }
}
