import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
