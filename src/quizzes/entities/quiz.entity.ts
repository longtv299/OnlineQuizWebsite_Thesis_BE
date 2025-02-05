import { Class } from '../../classes/entities/class.entity';
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
  
  @Column('float',{ nullable: true })
  pWrongQuestion?: number;
  
  @Column('float',{ nullable: true })
  pWrongOption?: number;

  @Column('json', { nullable: true })
  questions: Question[];

  @OneToMany('StudentAnswer', (result: StudentAnswer) => result.quiz)
  studentAnswers: StudentAnswer[];

  @ManyToOne(() => Class)
  class: Class;
}
