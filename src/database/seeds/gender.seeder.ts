import { Gender } from '../../genders/entities/gender.entity';
import { GenderEnum } from '../../genders/gender.enum';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const mockData: any[] = [
  { id: GenderEnum.Male, name: 'Male' },
  { id: GenderEnum.Female, name: 'Female' },
];

export class GenderSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const genderRepository = dataSource.getRepository(Gender);
    await genderRepository.save(mockData);
  }
}
