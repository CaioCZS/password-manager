import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { EraseDto } from './dtos/erase.dto';
import { AuthGuard } from '../guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  async delete(@Body() body: EraseDto, @User() user: UserPrisma) {
    await this.eraseService.delete(body, user);
  }
}
