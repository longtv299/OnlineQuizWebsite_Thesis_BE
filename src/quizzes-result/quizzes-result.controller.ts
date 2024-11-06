import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizzesResultService } from './quizzes-result.service';
import { CreateQuizzesResultDto } from './dto/create-quizzes-result.dto';
import { UpdateQuizzesResultDto } from './dto/update-quizzes-result.dto';

@Controller('quizzes-result')
export class QuizzesResultController {
  constructor(private readonly quizzesResultService: QuizzesResultService) {}

  @Post()
  create(@Body() createQuizzesResultDto: CreateQuizzesResultDto) {
    return this.quizzesResultService.create(createQuizzesResultDto);
  }

  @Get()
  findAll() {
    return this.quizzesResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesResultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizzesResultDto: UpdateQuizzesResultDto) {
    return this.quizzesResultService.update(+id, updateQuizzesResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesResultService.remove(+id);
  }
}
