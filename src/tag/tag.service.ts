import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  findAll(): void {
    console.log('hello');
  }
}
