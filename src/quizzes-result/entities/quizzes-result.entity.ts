import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Student } from '../../users/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuizzesResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Quiz)
  quiz: Quiz;

  @Column()
  score: number;
}
