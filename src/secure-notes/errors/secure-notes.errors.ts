import { HttpException, HttpStatus } from '@nestjs/common';

export class SecureNoteNotFound extends HttpException {
  constructor() {
    super('Secure note not found', HttpStatus.NOT_FOUND);
  }
}

export class SecureNoteIsNotFromUser extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
