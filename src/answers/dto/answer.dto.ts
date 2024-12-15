import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional()
  isCorrect?: boolean;
}
