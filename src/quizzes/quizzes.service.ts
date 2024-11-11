import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}
  create(createQuizDto: CreateQuizDto) {
    return this.quizRepository.save(createQuizDto);
  }

  findQuizzesForClass(id: number) {
    return this.quizRepository.find({
      where: { class: { id } },
    });
  }

  findOne(id: number) {
    return this.quizRepository.findOne({ where: { id } });
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return this.quizRepository.save({
      id,
      ...updateQuizDto,
    });
  }

  remove(id: number) {
    return this.quizRepository.delete(id);
  }
}
