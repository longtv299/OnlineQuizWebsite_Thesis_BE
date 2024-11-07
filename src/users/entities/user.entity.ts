import { Model } from '../../core/base.entity';
import { Gender } from '../../genders/entities/gender.entity';
import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity()
export class User extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  dateOfBirth: Date;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne(() => Gender)
  gender: Gender;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;

  @OneToOne(() => Student, (student) => student.user)
  student: Student;
}
