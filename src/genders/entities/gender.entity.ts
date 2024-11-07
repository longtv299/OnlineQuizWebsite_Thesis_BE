import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../core/base.entity';

@Entity()
export class Gender extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
