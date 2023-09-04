import { HttpException, HttpStatus } from '@nestjs/common';

export class TitleAlreadyInUse extends HttpException {
  constructor() {
    super('Este título já está em uso', HttpStatus.CONFLICT);
  }
}

export class CredentialNotFound extends HttpException {
  constructor() {
    super('Credencial não existe', HttpStatus.NOT_FOUND);
  }
}

export class CredentialIsNotFromUser extends HttpException {
  constructor() {
    super('Proibido!', HttpStatus.FORBIDDEN);
  }
}
