import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user.decorator';
import { ParseIdPipe } from '../pipes/id.pipe';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @User() user: UserPrisma) {
    await this.cardsService.create(createCardDto, user.id);
    return { message: 'Card created' };
  }

  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.cardsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    return this.cardsService.findOne(id, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseIdPipe()) id: number,
    @User() user: UserPrisma,
  ) {
    await this.cardsService.remove(id, user.id);
    return { message: 'Card deleted' };
  }
}
