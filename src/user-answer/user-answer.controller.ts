import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { ExcelUtil } from '../core/excel';
import { Response } from 'express';

@Controller('user-answer')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  @Post()
  create(@Body() createDto: CreateUserAnswerDto) {
    return this.userAnswerService.create(createDto);
  }

  @Get('find-many/by-class/:classId')
  findByClass(@Param('classId') classId: number) {
    return this.userAnswerService.findByClass(+classId);
  }
  @Get('find-many/by-student/:studentId')
  findByStudent(@Param('studentId') studentId: number) {
    return this.userAnswerService.findResultByStudent(+studentId);
  }

  @Get('find-one')
  findOne(
    @Query('studentId') studentId: string,
    @Query('quizId') quizId: string,
  ) {
    return this.userAnswerService.findOne(+studentId, +quizId);
  }
  @Get('export/by-quiz/:quizId')
  async exportByQuiz(@Res() res: Response, @Param('quizId') quizId: string) {
    const result = await this.userAnswerService.exportByQuizId(+quizId);
    res.set(ExcelUtil.header('result.xlsx')).send(result);
  }
  @Get('export/by-student/:studentId')
  async exportByStudent(
    @Res() res: Response,
    @Param('studentId') studentId: string,
  ) {
    const result = await this.userAnswerService.exportByStudent(+studentId);
    res.set(ExcelUtil.header('result.xlsx')).send(result);
  }
}
