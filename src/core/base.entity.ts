import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class Model {
  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
