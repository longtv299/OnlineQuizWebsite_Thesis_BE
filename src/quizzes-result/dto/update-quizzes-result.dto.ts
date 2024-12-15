import { PartialType } from '@nestjs/swagger';
import { CreateQuizzesResultDto } from './create-quizzes-result.dto';

export class UpdateQuizzesResultDto extends PartialType(
  CreateQuizzesResultDto,
) {}
