import { Class } from '../../classes/entities/class.entity';
import { QuizzesResult } from '../../quizzes-result/entities/quizzes-result.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../domain/question';
import { StudentAnswer } from '../../user-answer/entities/user-answer.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  time?: number;

  @Column({ nullable: true })
  scoreMethod?: 1 | 2 | 3;

  @Column('json', { nullable: true })
  questions: Question[];

  @OneToMany('QuizzesResult', (result: QuizzesResult) => result.quiz)
  quizzesResults: QuizzesResult[];

  @OneToMany('StudentAnswer', (result: StudentAnswer) => result.quiz)
  studentAnswers: StudentAnswer[];

  @ManyToOne(() => Class)
  class: Class;
}
