import { Question } from 'src/questions/entities/question.entity';
import { StudentAnswer } from 'src/user-answer/entities/user-answer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Answer {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
