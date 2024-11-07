import { Model } from '../../core/base.entity';
import { Question } from '../../questions/entities/question.entity';
import { StudentAnswer } from '../../user-answer/entities/user-answer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Answer extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @OneToMany(
    () => StudentAnswer,
    (studentAnswer) => studentAnswer.selectedAnswer,
  )
  studentAnswers: StudentAnswer[];
}
