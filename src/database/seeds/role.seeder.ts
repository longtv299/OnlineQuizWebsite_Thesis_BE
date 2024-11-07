import { Role } from '../../roles/entities/role.entity';
import { RoleEnum } from '../../roles/role.enum';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const mockData: Partial<Role>[] = [
  { id: RoleEnum.Teacher, name: 'Teacher' },
  { id: RoleEnum.Student, name: 'Student' },
];

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    await roleRepository.save(mockData);
  }
}
