import { Injectable } from '@nestjs/common';
@Injectable()
export class RolesService {
  findAll() {
    return `This action returns all roles`;
  }

  findById(id: number) {
    return `This action returns a #${id} role`;
  }
}
