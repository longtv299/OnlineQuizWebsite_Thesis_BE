import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { Class } from '../../classes/entities/class.entity';
import { ClassDto } from '../../classes/dto/class.dto';

export class CreateQuizDto {
  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ type: () => ClassDto })
  @Type(() => ClassDto)
  @ValidateNested()
  class: Class;
}
