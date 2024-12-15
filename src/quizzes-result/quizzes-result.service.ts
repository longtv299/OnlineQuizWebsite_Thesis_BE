import { Injectable } from '@nestjs/common';
import { CreateQuizzesResultDto } from './dto/create-quizzes-result.dto';
import { UpdateQuizzesResultDto } from './dto/update-quizzes-result.dto';

@Injectable()
export class QuizzesResultService {
  create(createQuizzesResultDto: CreateQuizzesResultDto) {
    return 'This action adds a new quizzesResult';
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
