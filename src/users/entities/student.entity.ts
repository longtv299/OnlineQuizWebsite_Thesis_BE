import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { QuizzesResult } from '../../quizzes-result/entities/quizzes-result.entity';
import { StudentAnswer } from '../../user-answer/entities/user-answer.entity';
import { Class } from '../../classes/entities/class.entity';
import { Model } from '../../core/base.entity';

@Entity()
export class Student extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany('QuizzesResult', (result: QuizzesResult) => result.student)
  quizzesResults: QuizzesResult[];

  @OneToMany('StudentAnswer', (answer: StudentAnswer) => answer.student)
  studentAnswers: StudentAnswer[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Class)
  class: Class;
}
