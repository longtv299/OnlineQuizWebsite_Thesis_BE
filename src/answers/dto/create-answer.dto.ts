import { ApiProperty, PickType } from '@nestjs/swagger';
import { Question } from '../../questions/entities/question.entity';

export class CreateAnswerDto {
  @ApiProperty({ type: PickType(Question, ['id']) })
  question: Question;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isCorrect: boolean;
}
