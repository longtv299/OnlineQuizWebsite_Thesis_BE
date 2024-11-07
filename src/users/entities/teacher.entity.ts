import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Class } from '../../classes/entities/class.entity';
import { Model } from '../../core/base.entity';

@Entity()
export class Teacher extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Class, (c) => c.teacher)
  classes: Class[];
}
