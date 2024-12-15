import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Class } from '../../classes/entities/class.entity';
import { ClassDto } from '../../classes/dto/class.dto';
import { QuestionDto } from '../../questions/dto/question.dto';

export class CreateQuizDto {
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ type: () => ClassDto })
  @Type(() => ClassDto)
  @ValidateNested()
  class: Class;

  @ApiProperty({ type: () => [QuestionDto] })
  @IsArray()
  @Type(() => QuestionDto)
  @ValidateNested()
  questions?: QuestionDto[];
}
