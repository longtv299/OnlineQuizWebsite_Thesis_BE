import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import { RoleSeeder } from './role.seeder';
import { GenderSeeder } from './gender.seeder';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, GenderSeeder);
    await runSeeder(dataSource, RoleSeeder);
    console.log('Seeders have been executed successfully');
  }
}
