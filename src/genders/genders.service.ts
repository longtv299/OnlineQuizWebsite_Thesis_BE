import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Gender } from './entities/gender.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GendersService {
  constructor(
    @InjectRepository(Gender)
    private readonly repository: Repository<Gender>,
  ) {}
  findAll() {
    return this.repository.find();
  }

  findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
