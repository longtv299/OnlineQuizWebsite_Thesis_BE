import { Question } from '../../quizzes/domain/question';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Student } from '../../users/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class StudentAnswer {
  @PrimaryColumn()
  studentId: number;

  @PrimaryColumn()
  quizId: number;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Quiz)
  quiz: Quiz;

  @Column('json', { nullable: true })
  studentQuizAnswer: Question[];
}
