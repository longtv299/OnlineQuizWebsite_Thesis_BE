import { Injectable } from '@nestjs/common';

@Injectable()
export class GendersService {
  findAll() {
    return `This action returns all genders`;
  }

  findById(id: number) {
    return `This action returns a #${id} gender`;
  }
}
