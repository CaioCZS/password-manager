/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    if (!value) throw new BadRequestException('Invalid id');

    const numberId = parseInt(value);
    if (isNaN(numberId)) {
      throw new BadRequestException('Invalid id');
    }
    return numberId;
  }
}
