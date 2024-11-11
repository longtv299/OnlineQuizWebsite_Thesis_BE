import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { Student } from '../../users/entities/student.entity';

@Entity('class_user')
@Unique(['group', 'student'])
export class ClassUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Class)
  group: Class;

  @ManyToOne(() => Student)
  student: Student;
}
