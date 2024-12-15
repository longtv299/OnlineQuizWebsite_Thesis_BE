import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, ValidateNested, IsArray } from 'class-validator';
import { ClassDto } from '../../classes/dto/class.dto';
import { Class } from '../../classes/entities/class.entity';
import { QuestionDto } from '../../questions/dto/question.dto';
import { Question } from '../../questions/entities/question.entity';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ type: () => ClassDto })
  @Type(() => ClassDto)
  @ValidateNested()
  class?: Class;

  @ApiPropertyOptional({ type: () => [QuestionDto] })
  @IsArray()
  @Type(() => QuestionDto)
  @ValidateNested()
  questions?: Question[];
}
