import { Module } from '@nestjs/common';
import { QuizzesResultService } from './quizzes-result.service';
import { QuizzesResultController } from './quizzes-result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesResult } from './entities/quizzes-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizzesResult])],
  controllers: [QuizzesResultController],
  providers: [QuizzesResultService, QuizzesResultService],
  exports: [QuizzesResultService]
})
export class QuizzesResultModule {}
