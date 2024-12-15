import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly questionService: QuestionsService,
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

  async update(id: number, updateDto: UpdateQuizDto) {
    if (updateDto.questions) {
      const updateQuestions = [];
      const createQuestions = [];
      updateDto.questions.forEach((q) => {
        if (q.id) {
          updateQuestions.push(q);
        } else {
          createQuestions.push(q);
        }
      });
      await this.questionService.createMany(createQuestions);
    }
    return await this.quizRepository.save({
      id,
      ...updateDto,
    });
  }

  remove(id: number) {
    return this.quizRepository.delete(id);
  }
}
