import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Question } from '../entities/question.entity';
import { AnswerDto } from '../../answers/dto/answer.dto';
import { Answer } from '../../answers/entities/answer.entity';

export class QuestionDto extends Question {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  isChooseOne: boolean;

  @ApiPropertyOptional()
  content: string;

  @ApiPropertyOptional({ type: () => [AnswerDto] })
  @IsArray()
  @Type(() => AnswerDto)
  @ValidateNested()
  answers: Answer[];
}
