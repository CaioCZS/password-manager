import { HttpException, HttpStatus } from '@nestjs/common';

export class IncompatibleData extends HttpException {
  constructor() {
    super('E-mail e/ou senha inválidos', HttpStatus.UNAUTHORIZED);
  }
}
