import { Answer } from '../../answers/entities/answer.entity';
import { Student } from '../../users/entities/student.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StudentAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Answer)
  selectedAnswer: Answer;
}
