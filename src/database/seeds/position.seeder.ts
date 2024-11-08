import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Position } from '../../positions/entities/position.entity';
import { PositionEnum } from '../../positions/position.enum';

const mockData: Partial<Position>[] = [
  { id: PositionEnum.Teacher, name: 'Teacher' },
  { id: PositionEnum.Student, name: 'Student' },
];

export class PositionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const positionRepository = dataSource.getRepository(Position);
    await positionRepository.save(mockData);
  }
}
