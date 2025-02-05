import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { StudentAnswer } from '../../user-answer/entities/user-answer.entity';
import { Class } from '../../classes/entities/class.entity';
import { Model } from '../../core/base.entity';
import { ClassStudent } from '../../class-student/entities/class-student.entity';

@Entity()
export class Student extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany('StudentAnswer', (answer: StudentAnswer) => answer.student)
  studentAnswers: StudentAnswer[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany('ClassStudent', (e: ClassStudent) => e.student)
  classStudents: ClassStudent[];
}
