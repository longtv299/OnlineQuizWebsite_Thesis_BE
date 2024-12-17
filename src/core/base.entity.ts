import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Model {
  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
