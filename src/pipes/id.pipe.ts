/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const numberId = parseInt(value);
    if (isNaN(numberId) || numberId <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return numberId;
  }
}
