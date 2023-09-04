import { HttpException, HttpStatus } from '@nestjs/common';

export class CredentialNotFound extends HttpException {
  constructor() {
    super('Credential not found', HttpStatus.NOT_FOUND);
  }
}

export class CredentialIsNotFromUser extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
