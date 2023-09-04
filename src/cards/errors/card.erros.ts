import { HttpException, HttpStatus } from '@nestjs/common';

export class CardNotFound extends HttpException {
  constructor() {
    super('Card not found', HttpStatus.NOT_FOUND);
  }
}
export class CardIsNotFromUser extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
