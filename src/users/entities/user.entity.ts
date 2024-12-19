import { Model } from '../../core/base.entity';
import { Gender } from '../../genders/entities/gender.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';
import { Position } from '../../positions/entities/position.entity';

@Entity()
export class User extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column()
  dateOfBirth: Date;

  @ManyToOne(() => Position)
  position: Position;

  @ManyToOne(() => Gender)
  gender: Gender;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { onDelete: 'CASCADE' })
  teacher: Teacher;

  @OneToOne(() => Student, (student) => student.user, { onDelete: 'CASCADE' })
  student: Student;
}
