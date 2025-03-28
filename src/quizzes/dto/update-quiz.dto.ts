import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  ValidateNested,
  IsArray,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ClassDto } from '../../classes/dto/class.dto';
import { Class } from '../../classes/entities/class.entity';
import { IdentityDto } from '../../core/identity.dto';
import { Question } from '../domain/question';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  time: number;

  @ApiProperty({ enum: [1, 3] })
  @IsNotEmpty()
  @IsNumber()
  scoreMethod: 1 | 3;

  @ApiPropertyOptional({ type: () => ClassDto })
  @Type(() => ClassDto)
  @ValidateNested()
  class?: Class;

  @ApiPropertyOptional({ type: () => [IdentityDto] })
  @IsArray()
  @Type(() => IdentityDto)
  @ValidateNested()
  questions?: Question[];
}
