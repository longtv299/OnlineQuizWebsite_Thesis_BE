import { config } from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: '.env' });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  timezone: '+07:00',
  synchronize: true,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    subscribersDir: 'subscriber',
  },
} as DataSourceOptions);
