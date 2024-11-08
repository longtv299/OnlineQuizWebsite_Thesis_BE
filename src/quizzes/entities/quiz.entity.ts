import { Class } from '../../classes/entities/class.entity';
import { Question } from '../../questions/entities/question.entity';
import { QuizzesResult } from '../../quizzes-result/entities/quizzes-result.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @OneToMany(() => QuizzesResult, (result) => result.quiz)
  quizzesResults: QuizzesResult[];

  @ManyToOne(() => Class)
  class: Class;
}
