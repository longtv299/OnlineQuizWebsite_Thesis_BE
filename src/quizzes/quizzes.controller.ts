import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { QuizzesService } from './services/quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizDto } from './dto/quiz.dto';
import { User } from '../users/entities/user.entity';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }
  @Post('clone/by-id')
  clone(@Body() payload: QuizDto) {
    return this.quizzesService.clone(+payload.id, +payload.class.id);
  }

  @Get()
  findAll(@Req() request: Request, @Query('classId') classId: number) {
    const user: User | null = request['user'];
    if (user?.student?.id) {
      return this.quizzesService.findQuizzesByClassAndStudent(
        +classId,
        user.student.id,
      );
    }
    return this.quizzesService.findQuizzesForClass(+classId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(+id);
  }

  @Get(':id/only-question')
  findOneWithoutAnswer(@Param('id') id: string) {
    return this.quizzesService.findOneWithoutAnswer(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(+id);
  }
}
