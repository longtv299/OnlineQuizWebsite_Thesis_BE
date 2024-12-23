import { Injectable } from '@nestjs/common';
import { CreateQuizzesResultDto } from './dto/create-quizzes-result.dto';
import { UpdateQuizzesResultDto } from './dto/update-quizzes-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizzesResult } from './entities/quizzes-result.entity';

@Injectable()
export class QuizzesResultService {
  constructor(
      @InjectRepository(QuizzesResult)
      private readonly repository: Repository<QuizzesResult>,
    ) {}
  create(createQuizzesResultDto: CreateQuizzesResultDto) {
    return this.repository.save(createQuizzesResultDto)
  }

  findAll() {
    return `This action returns all quizzesResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizzesResult`;
  }

  update(id: number, updateQuizzesResultDto: UpdateQuizzesResultDto) {
    return `This action updates a #${id} quizzesResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizzesResult`;
  }
}
