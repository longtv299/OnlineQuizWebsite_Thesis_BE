import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAnswerDto } from '../../answers/dto/create-answer.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  isChooseOne: boolean;

  @ApiPropertyOptional()
  content: string;

  @ApiPropertyOptional({ type: () => [CreateAnswerDto] })
  @IsArray()
  @Type(() => CreateAnswerDto)
  @ValidateNested()
  answers: CreateAnswerDto[];
}
