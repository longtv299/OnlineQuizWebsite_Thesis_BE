import { ClassStudent } from '../../class-student/entities/class-student.entity';
import { Model } from '../../core/base.entity';
import { Teacher } from '../../users/entities/teacher.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Class extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Teacher)
  teacher: Teacher;

  @OneToMany(() => ClassStudent, (e) => e.group)
  classStudent: ClassStudent[];
}
