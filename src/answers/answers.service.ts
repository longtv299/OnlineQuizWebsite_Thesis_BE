import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly repository: Repository<Answer>,
  ) {}
  create(createDto: CreateAnswerDto) {
    return this.repository.save(createDto);
  }

  findAllByQuestion(questionId: number) {
    this.repository.find({
      where: { question: { id: questionId } },
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
  async updateMany(updateManyDto: UpdateAnswerDto[]) {
    await Promise.all(createManyDto.map((e) => this.create(e)));
  }
}
