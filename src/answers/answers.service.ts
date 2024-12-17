import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly repository: Repository<Answer>,
  ) {}
  create(createDto: CreateAnswerDto) {
    return this.repository.save(createDto);
  }

  createManyInQuestion(questionId: number, answers: CreateAnswerDto[]) {
    const question = new Question();
    question.id = questionId;
    const saveAnswers = answers.map((a) => {
      return {
        question,
        content: a.content,
        isCorrect: a.isCorrect,
      } as Answer;
    });
    return this.repository.insert(saveAnswers);
  }

  findAllByQuestion(questionId: number) {
    return this.repository.find({
      where: { question: { id: questionId } },
    });
  }
  findAllByQuiz(quizId: number) {
    return this.repository.find({
      where: { question: { quiz: { id: quizId } } },
    });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateDto: UpdateAnswerDto) {
    return this.repository.save({
      id,
      ...updateDto,
    });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
  async createMany(createManyDto: CreateAnswerDto[]) {
    await Promise.all(createManyDto.map((e) => this.create(e)));
  }
}
