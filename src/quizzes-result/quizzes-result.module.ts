import { Module } from '@nestjs/common';
import { QuizzesResultService } from './quizzes-result.service';
import { QuizzesResultController } from './quizzes-result.controller';

@Module({
  controllers: [QuizzesResultController],
  providers: [QuizzesResultService],
})
export class QuizzesResultModule {}
