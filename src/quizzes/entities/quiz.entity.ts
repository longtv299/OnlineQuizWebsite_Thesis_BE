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

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  time? : number;

  // @OneToMany('Question', (question: Question) => question.quiz)
  @Column('json', { nullable: true })
  questions: Question[];

  @OneToMany('QuizzesResult', (result: QuizzesResult) => result.quiz)
  quizzesResults: QuizzesResult[];

  @ManyToOne(() => Class)
  class: Class;
}
