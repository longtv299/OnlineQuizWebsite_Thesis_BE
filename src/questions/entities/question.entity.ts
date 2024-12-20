import { Answer } from '../../answers/entities/answer.entity';
import { Model } from '../../core/base.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Question extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isChooseOne: boolean;

  @Column()
  content: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @OneToMany('Answer', (answer: Answer) => answer.question)
  answers: Answer[];
}
