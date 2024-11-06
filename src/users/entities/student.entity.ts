import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { QuizzesResult } from 'src/quizzes-result/entities/quizzes-result.entity';
import { StudentAnswer } from 'src/user-answer/entities/user-answer.entity';
import { Class } from 'src/classes/entities/class.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => QuizzesResult, (result) => result.student)
  quizzesResults: QuizzesResult[];

  @OneToMany(() => StudentAnswer, (answer) => answer.student)
  studentAnswers: StudentAnswer[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Class)
  class: Class;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
