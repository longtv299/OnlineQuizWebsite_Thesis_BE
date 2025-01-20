import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, ValidateNested } from "class-validator";
import { Quiz } from "../../quizzes/entities/quiz.entity";
import { Type } from "class-transformer";
import { QuizDto } from "../../quizzes/dto/quiz.dto";
import { Student } from "../../users/entities/student.entity";
import { StudentDto } from "../../users/dto/student.dto";

export class CreateQuizzesResultDto {
    @ApiProperty({ type: () => StudentDto })
    @Type(() => StudentDto)
    @ValidateNested()
    student: Student;

    @ApiProperty({ type: () => QuizDto })
    @Type(() => QuizDto)
    @ValidateNested()
    quiz: Quiz;

    @ApiProperty({type: Number})
    @IsNumber()
    score: number;
}
