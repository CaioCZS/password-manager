import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyInUse extends HttpException {
  constructor() {
    super('E-mail already in use', HttpStatus.CONFLICT);
  }
}
