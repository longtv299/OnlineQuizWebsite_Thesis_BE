import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { Repository } from 'typeorm';
@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly repository: Repository<Position>,
  ) {}
  findAll() {
    return this.repository.find();
  }

  findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
