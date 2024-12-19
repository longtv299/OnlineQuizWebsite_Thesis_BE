import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { NotFound } from '../core/exceptions';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly questionService: QuestionsService,
    private readonly answerService: AnswersService,
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
      await this.questionService.removeByQuizId(id);
      await this.questionService.createMany(id, updateDto.questions);
    }
    return await this.quizRepository.save({
      id,
      ...updateDto,
    });
  }

  remove(id: number) {
    return this.quizRepository.delete(id);
  }
  async clone(id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: {
        class: true,
      },
    });
    if (!quiz) {
      throw new NotFound();
    }
    const cloneQuiz = await this.quizRepository.save({
      ...quiz,
      id: null,
    });
    const questions = await this.questionService.findAllByQuizWithCorrect(id);
    await this.questionService.createMany(cloneQuiz.id, questions);
    return cloneQuiz;
  }
}
