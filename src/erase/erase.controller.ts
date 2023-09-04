import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EraseService } from './erase.service';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { EraseDto } from './dtos/erase.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('erase')
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @ApiOperation({ summary: 'Delete user data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User for token given not foud',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Password send wrong',
  })
  @Delete()
  async delete(@Body() body: EraseDto, @User() user: UserPrisma) {
    await this.eraseService.delete(body, user);
  }
}
