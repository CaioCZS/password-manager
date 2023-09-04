import { HttpException, HttpStatus } from '@nestjs/common';

export class TitleAlreadyInUse extends HttpException {
  constructor() {
    super('Title already in use', HttpStatus.CONFLICT);
  }
}
